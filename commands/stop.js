const { SlashCommandBuilder } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback and clear the queue'),
 async execute(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
  try {
   await queue.stop();
   await interaction.reply({ content: '⏹ Stopped playback and cleared the queue.' });
  } catch (err) {
   console.error(err);
   await interaction.reply({ content: '❌ Could not stop playback.', ephemeral: true });
  }
 }
};