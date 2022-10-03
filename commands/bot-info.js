// Get bot info

const { botInfo, colors } = require('../config.json');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    async buildCommand() {
        return new SlashCommandBuilder()
            .setName('botinfo')
            .setDescription("Get bot info.")
    },

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(botInfo.name)
            .setColor(colors.icon)
            .setDescription(botInfo.description)
            .setThumbnail(botInfo.logo);

        await interaction.reply({ embeds: [embed] })
    }
}