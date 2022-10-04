// Show character summary

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');
const { listToChoices } = require("../util");
const { colors } = require("../config.json")


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

        const serverDesc = `DC/Server: ${character.datacenter}/${character.server}`;
        const curJobDesc = `Current Job: ${character.mainJob.name}`;
        const fcDesc = `Free Company: ${character.freeCompanyName}`;

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

        // Construct general tab
        const generalEmbed = new EmbedBuilder()
            .setColor(colors.character)
            .setTitle(character.name)
            .setDescription(`${serverDesc}\n${curJobDesc}\n${fcDesc}`)
            .setImage(character.fullBodyImg);

        const generalReply = { content: "", embeds: [generalEmbed], components: [actionRow], fetchReply: true };

        // Construct job tab
        const jobEmbed = new EmbedBuilder()
            .setColor(colors.character)
            .setTitle(character.name)
            .setDescription(`${curJobDesc}`)
            .setThumbnail(character.avatarImg);

        const jobEmbedFields = [];

        const jobCategories = xivapi.getJobCategories();
        for (const jobCategoryId in jobCategories) {
            jobEmbedFields.push({ 
                name: jobCategories[jobCategoryId],
                value: character.jobs
                    .filter(job => job.categoryId == jobCategoryId) // Only include jobs of this category
                    .map(job => `${job.name} (${job.level})`) // Convert to string (name + level)
                    .join("\n"), // Separate line by line
                inline: true
            });
        }

        jobEmbed.addFields(...jobEmbedFields);

        const jobReply = { content: "", embeds: [jobEmbed] };

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