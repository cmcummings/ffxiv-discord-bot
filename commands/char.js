// Show character summary

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const { listToChoices } = require("../util");

module.exports = {
    async buildCommand(xivapi) {
        const serverChoices = listToChoices(["Sargatanas", "Famfrit", "Exodus"]);

        return new SlashCommandBuilder()
            .setName('char')
            .setDescription("View a character.")
            .addStringOption(option =>
                option.setName('name')
                    .setDescription("The character's name.")
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('server')
                    .setDescription("The server the character is located.")
                    .setRequired(true)
                    .setChoices(...serverChoices));
    },

    async execute(interaction, xivapi) {
        const name = interaction.options.getString('name');
        const server = interaction.options.getString('server');
        const character = await xivapi.getCharacter(name, server);

        if (!character) {
            const msg = `The character "${name}" from ${server} could not be found.`
            await interaction.reply({ content: msg, ephemeral: true });
            return;
        }

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("tab")
                    .setPlaceholder("More information...")
                    .addOptions(
                        {
                            label: "General",
                            description: "General information about the character.",
                            value: "general"
                        },
                        {
                            label: "Jobs",
                            description: "Character's job information.",
                            value: "jobs"
                        }
                    )
            );

        const generalReply = { embeds: [await character.buildGeneralEmbed(xivapi)], components: [actionRow], fetchReply: true };
        const jobReply = { embeds: [await character.buildJobEmbed(xivapi)] };

        await interaction.reply(generalReply)
            .then(message => {
                const collector = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 120000 });

                collector.on('collect', i => {
                    if (i.user.id !== interaction.user.id) 
                        return;
                    
                    const key = i.values[0];

                    if (key === "general") {
                        i.update(generalReply);
                    } else if (key === "jobs") {
                        i.update(jobReply);
                    }
                });

                collector.on('end', () => {
                    message.delete();
                })
            });
    }
}