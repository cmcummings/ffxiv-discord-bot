// Retrieve all datacenters

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    async buildCommand() { 
        return new SlashCommandBuilder()
	    .setName("datacenters")
	    .setDescription("List all FFXIV datacenters.");
    },

    async execute(interaction, xivapi) {
        let dcs = await xivapi.getDataCenters();
        await interaction.reply(dcs.join("\n"));
    }
}