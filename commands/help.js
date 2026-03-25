const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available music commands'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🎵 Elite Music Bot — Commands')
      .setDescription('Use the slash commands below to control music playback.\nButtons also appear automatically when a song starts!')
      .addFields(
        {
          name: '▶️ Playback',
          value: [
            '`/play <query>` — Play a song, playlist or URL',
            '`/pause` — Pause playback',
            '`/resume` — Resume playback',
            '`/skip` — Skip the current song',
            '`/stop` — Stop and clear the queue',
            '`/leave` — Kick the bot out of voice',
            '`/seek <seconds>` — Jump to a position in the song',
          ].join('\n')
        },
        {
          name: '📋 Queue',
          value: [
            '`/queue` — Show the current queue (paginated)',
            '`/nowplaying` — Show current song + controls',
            '`/shuffle` — Shuffle the queue',
          ].join('\n')
        },
        {
          name: '⚙️ Settings',
          value: [
            '`/volume <1-100>` — Set playback volume',
            '`/loop <off|song|queue>` — Set repeat mode',
            '`/filter <preset>` — Apply an audio filter',
          ].join('\n')
        },
        {
          name: '🎛️ Audio Filters',
          value: '`bassboost` · `nightcore` · `vaporwave` · `8d` · `clear`',
        },
        {
          name: '🎮 Button Controls (auto-shown on each song)',
          value: '⏮ Prev  ·  ⏸/▶️ Pause/Resume  ·  ⏭ Skip  ·  ⏹ Stop  ·  🔁 Loop\n🔀 Shuffle  ·  🔉 Vol-  ·  🔊 Vol+',
        }
      )
      .setFooter({ text: 'Elite Music Bot • Tip: You must be in a voice channel to play music!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
