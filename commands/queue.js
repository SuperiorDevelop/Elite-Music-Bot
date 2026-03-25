const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const PAGE_SIZE = 10;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue')
    .addIntegerOption(opt =>
      opt.setName('page').setDescription('Page number').setMinValue(1)
    ),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length)
      return interaction.reply({ content: '❌ The queue is empty.', ephemeral: true });

    const totalPages = Math.ceil(queue.songs.length / PAGE_SIZE);
    let page = Math.min(interaction.options.getInteger('page') ?? 1, totalPages);
    page = Math.max(page, 1);

    const buildEmbed = (p) => {
      const start = (p - 1) * PAGE_SIZE;
      const songs = queue.songs.slice(start, start + PAGE_SIZE).map((s, i) => {
        const idx = start + i;
        const prefix = idx === 0 ? '▶️' : `\`#${idx}\``;
        return `${prefix} **${s.name}** — \`${s.formattedDuration}\``;
      });

      return new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('📋 Music Queue')
        .setDescription(songs.join('\n'))
        .setFooter({ text: `Page ${p}/${totalPages} • ${queue.songs.length} song(s) total` });
    };

    const buildRow = (p) => new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`queue_prev_${p}`)
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(p <= 1),
      new ButtonBuilder()
        .setCustomId(`queue_next_${p}`)
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(p >= totalPages)
    );

    const msg = await interaction.reply({
      embeds: [buildEmbed(page)],
      components: totalPages > 1 ? [buildRow(page)] : [],
      fetchReply: true
    });

    if (totalPages <= 1) return;

    // Collector for queue pagination buttons (only for this message, 60s timeout)
    const collector = msg.createMessageComponentCollector({ time: 60_000 });
    collector.on('collect', async btn => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: '❌ These controls belong to someone else.', ephemeral: true });
      }
      if (btn.customId.startsWith('queue_prev_')) page = Math.max(page - 1, 1);
      if (btn.customId.startsWith('queue_next_')) page = Math.min(page + 1, totalPages);
      await btn.update({ embeds: [buildEmbed(page)], components: [buildRow(page)] });
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] }).catch(() => {});
    });
  }
};