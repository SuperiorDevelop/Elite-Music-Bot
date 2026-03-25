const { SlashCommandBuilder } = require('discord.js');

// DisTube v5 built-in filter names
const FILTERS = {
  bassboost: '🔈 Bass Boost',
  nightcore: '🌙 Nightcore',
  vaporwave: '🌊 Vaporwave',
  '8d': '🎧 8D Audio',
  clear: '✨ Clear (no filter)'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Apply an audio filter to the current song')
    .addStringOption(opt =>
      opt.setName('preset')
        .setDescription('Which filter to apply')
        .setRequired(true)
        .addChoices(
          { name: '🔈 Bass Boost', value: 'bassboost' },
          { name: '🌙 Nightcore', value: 'nightcore' },
          { name: '🌊 Vaporwave', value: 'vaporwave' },
          { name: '🎧 8D Audio', value: '8d' },
          { name: '✨ Clear (remove filters)', value: 'clear' }
        )
    ),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });

    const preset = interaction.options.getString('preset');
    await interaction.deferReply();

    try {
      if (preset === 'clear') {
        await queue.filters.clear();
      } else {
        await queue.filters.set([preset]);
      }
      await interaction.editReply({
        embeds: [{
          color: 0x5865F2,
          description: `🎛 Filter applied: **${FILTERS[preset]}**`
        }]
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({ content: '❌ Could not apply filter.' });
    }
  }
};
