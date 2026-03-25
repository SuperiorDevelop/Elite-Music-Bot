const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

// Support multiple guilds via `guildIds` array, fallback to single `guildId`
const guildIds = config.guildIds ?? [config.guildId];

(async () => {
  for (const guildId of guildIds) {
    try {
      console.log(`Registering ${commands.length} slash commands to guild ${guildId}...`);
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Successfully registered to guild ${guildId}`);
    } catch (error) {
      console.error(`❌ Failed for guild ${guildId}:`, error);
    }
  }
  console.log('Done!');
})();