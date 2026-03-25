const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMusicButtons, getMusicButtonsRow2, getMusicEmbed } = require('../utils/musicButtons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song with controls'),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length)
      return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });

    const song = queue.songs[0];
    const embed = getMusicEmbed(song, queue);
    const row1 = getMusicButtons(queue);
    const row2 = getMusicButtonsRow2(queue);

    await interaction.reply({ embeds: [embed], components: [row1, row2] });
  }
};