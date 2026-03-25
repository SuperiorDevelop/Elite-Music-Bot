const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a position in the current song')
    .addIntegerOption(opt =>
      opt.setName('seconds')
        .setDescription('Position to seek to (in seconds)')
        .setRequired(true)
        .setMinValue(0)
    ),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });

    const seconds = interaction.options.getInteger('seconds');
    const song = queue.songs[0];

    if (seconds > song.duration)
      return interaction.reply({ content: `❌ Seek position exceeds song duration (${song.formattedDuration}).`, ephemeral: true });

    try {
      await queue.seek(seconds);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      await interaction.reply({
        embeds: [{
          color: 0x5865F2,
          description: `⏩ Seeked to **${m}:${s.toString().padStart(2, '0')}**`
        }]
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Could not seek.', ephemeral: true });
    }
  }
};
