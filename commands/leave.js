const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Stop music and make the bot leave the voice channel'),
  async execute(interaction, distube) {
    // Check if bot is even in a voice channel
    const botVc = interaction.guild.members.me?.voice?.channel;
    if (!botVc) return interaction.reply({ content: '❌ Bot is not in a voice channel.', ephemeral: true });

    try {
      // Try stopping the DisTube queue first (if one exists)
      const queue = distube.getQueue(interaction.guildId);
      if (queue) await queue.stop();

      // Force-disconnect via @discordjs/voice as a fallback
      const conn = getVoiceConnection(interaction.guildId);
      if (conn) conn.destroy();

      await interaction.reply({ content: '👋 Left the voice channel.' });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Could not leave the voice channel.', ephemeral: true });
    }
  }
};