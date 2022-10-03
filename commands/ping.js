// Test ping command

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    async buildCommand() {
        return new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!');
    },

    async execute(interaction) {
        await interaction.reply("Pong!");
    }
}