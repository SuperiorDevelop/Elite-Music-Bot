const { SlashCommandBuilder } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder().setName('pause').setDescription('Pause playback'),
 async execute(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
  try {
   await queue.pause();
   await interaction.reply({ content: '⏸ Paused.' });
  } catch (err) {
   console.error(err);
   await interaction.reply({ content: '❌ Could not pause.', ephemeral: true });
  }
 }
};