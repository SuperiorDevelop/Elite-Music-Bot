const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the playback volume (1–100)')
    .addIntegerOption(opt =>
      opt.setName('level')
        .setDescription('Volume level from 1 to 100')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });

    const level = interaction.options.getInteger('level');
    queue.setVolume(level);
    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        description: `🔊 Volume set to **${level}%**`
      }]
    });
  }
};
