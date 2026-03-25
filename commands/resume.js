const { SlashCommandBuilder } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder().setName('resume').setDescription('Resume playback'),
 async execute(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
  try {
   await queue.resume();
   await interaction.reply({ content: '▶ Resumed.' });
  } catch (err) {
   console.error(err);
   await interaction.reply({ content: '❌ Could not resume.', ephemeral: true });
  }
 }
};