const { SlashCommandBuilder } = require('discord.js');

const MODES = { off: 0, song: 1, queue: 2 };
const LABELS = ['❌ Off', '🔂 Song', '🔁 Queue'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set the loop/repeat mode')
    .addStringOption(opt =>
      opt.setName('mode')
        .setDescription('Which loop mode to set')
        .setRequired(true)
        .addChoices(
          { name: '❌ Off', value: 'off' },
          { name: '🔂 Song – repeat current song', value: 'song' },
          { name: '🔁 Queue – repeat entire queue', value: 'queue' }
        )
    ),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });

    const choice = interaction.options.getString('mode');
    const modeNum = MODES[choice];
    queue.setRepeatMode(modeNum);

    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        description: `Loop mode set to **${LABELS[modeNum]}**`
      }]
    });
  }
};
