require('dotenv').config()

const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');

// Create API instance
const { FFXIVAPI } = require('./ffxiv_api/ffxiv-api');
const ffxivapi = new FFXIVAPI(process.env.XIVAPI_KEY);

async function main() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        const builtcmd = await command.buildCommand(ffxivapi);
        commands.push(builtcmd.toJSON());
    }
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(data => console.log(`Successfully registered ${data.length} application commands.`))
        .catch(console.error);
}

main();