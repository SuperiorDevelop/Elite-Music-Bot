const { SlashCommandBuilder } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder().setName('skip').setDescription('Skip current song'),
 async execute(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: 'There is nothing playing right now.', ephemeral: true });
  try {
   await queue.skip();
   await interaction.reply({ content: '⏭ Skipped the current song.' });
  } catch (err) {
   console.error(err);
   await interaction.reply({ content: '❌ Could not skip the song.', ephemeral: true });
  }
 }
};