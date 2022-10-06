const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, CommandInteraction } = require("discord.js");
const { listToChoices } = require("../util");
const Jimp = require("jimp");
const { colors } = require("../config.json");

module.exports = {
    async buildCommand(xivapi) {
        const serverChoices = listToChoices(["Sargatanas"]);

        return new SlashCommandBuilder()
            .setName("fc")
            .setDescription("View a Free Company.")
            .addStringOption(option =>
                option.setName('name')
                    .setDescription("The Free Company's name.")
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('server')
                    .setDescription("The server the Free Company is located.")
                    .setRequired(true)
                    .setChoices(...serverChoices));
    },

    async execute(interaction, xivapi) {
        await interaction.deferReply();
        
        const name = interaction.options.getString('name');
        const server = interaction.options.getString('server');
        const fc = await xivapi.getFreeCompany(name, server);

        if (!fc) {
            const msg = `The Free Company "${name}" from ${server} could not be found.`
            await interaction.reply({ content: msg, ephemeral: true });
            return;
        }

        const embed = fc.buildEmbed();

        await interaction.editReply({ embeds: [embed] });

        // Construct FC crest and update reply
        const crestBuffer = await fc.getCrestAsBuffer();
        const crestFile = new AttachmentBuilder(crestBuffer, { name: "crest.png" });
        
        embed.setThumbnail("attachment://crest.png");
    
        await interaction.editReply({ embeds: [embed], files: [crestFile] });
    }
}