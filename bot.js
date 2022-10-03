require('dotenv').config()

// Require dependencies
const { REST, Routes, Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// Create API instance
const { FFXIVAPI } = require('./ffxiv_api/ffxiv-api')
const ffxivapi = new FFXIVAPI(process.env.XIVAPI_KEY);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    client.user.setActivity('"Oblivion"', { type: ActivityType.Listening });

	console.log('Ready!');
});

(async () => {
    // Load commands from files
    client.commands = new Collection();
    const builtcmds = []
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        const builtcmd = await command.buildCommand(ffxivapi);
        builtcmds.push(builtcmd.toJSON())
        client.commands.set(builtcmd.name, command);
    }

    // Register commands to Discord
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: builtcmds })
        .then(data => console.log(`Successfully registered ${data.length} application commands.`))
        .catch(console.error);
})();

client.on('interactionCreate', async interaction => {
	if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, ffxivapi);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred when processing this command.', ephemeral: true });
        }
    }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);