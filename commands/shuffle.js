const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the current queue'),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length <= 1)
      return interaction.reply({ content: '❌ Not enough songs in the queue to shuffle.', ephemeral: true });

    queue.shuffle();
    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        description: `🔀 Queue has been **shuffled**! (${queue.songs.length} songs)`
      }]
    });
  }
};
