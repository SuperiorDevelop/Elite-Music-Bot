const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');
const { buildProgressBar } = require('./progressBar');

// DisTube v5 RepeatMode enum values
const RepeatMode = { DISABLED: 0, SONG: 1, QUEUE: 2 };

/**
 * Builds the music control button row.
 * @param {import('distube').Queue} queue
 * @returns {ActionRowBuilder}
 */
function getMusicButtons(queue) {
  const paused = queue ? queue.paused : false;
  const loopMode = queue ? queue.repeatMode : 0;

  const loopLabel =
    loopMode === RepeatMode.SONG ? '🔂 Song' :
    loopMode === RepeatMode.QUEUE ? '🔁 Queue' :
    '🔁 Off';

  const loopStyle =
    loopMode === RepeatMode.DISABLED ? ButtonStyle.Secondary :
    ButtonStyle.Success;

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('music_prev')
      .setEmoji('⏮')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music_pause')
      .setEmoji(paused ? '▶️' : '⏸️')
      .setStyle(paused ? ButtonStyle.Success : ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('music_skip')
      .setEmoji('⏭')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music_stop')
      .setEmoji('⏹️')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('music_loop')
      .setLabel(loopLabel)
      .setStyle(loopStyle)
  );
}

/**
 * Builds a second row with shuffle button.
 * @param {import('distube').Queue} queue
 * @returns {ActionRowBuilder}
 */
function getMusicButtonsRow2(queue) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('music_shuffle')
      .setEmoji('🔀')
      .setLabel('Shuffle')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music_voldown')
      .setEmoji('🔉')
      .setLabel('-10%')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music_volup')
      .setEmoji('🔊')
      .setLabel('+10%')
      .setStyle(ButtonStyle.Secondary)
  );
}

/**
 * Builds the "Now Playing" embed with progress bar and queue info.
 * @param {import('distube').Song} song
 * @param {import('distube').Queue} queue
 * @returns {EmbedBuilder}
 */
function getMusicEmbed(song, queue) {
  const current = queue ? queue.currentTime : 0;
  const total = song.duration;
  const progressBar = buildProgressBar(current, total, 18);

  const loopMode = queue ? queue.repeatMode : 0;
  const loopText =
    loopMode === RepeatMode.SONG ? '🔂 Song' :
    loopMode === RepeatMode.QUEUE ? '🔁 Queue' :
    '❌ Off';

  const volume = queue ? queue.volume : 100;
  const remaining = queue ? Math.max(queue.songs.length - 1, 0) : 0;

  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setAuthor({ name: '🎶 Now Playing' })
    .setTitle(song.name || 'Unknown Title')
    .setURL(song.url || null)
    .setThumbnail(song.thumbnail || null)
    .addFields(
      { name: '⏱ Duration', value: song.formattedDuration || '?', inline: true },
      { name: '🔊 Volume', value: `${volume}%`, inline: true },
      { name: '🔁 Loop', value: loopText, inline: true },
      { name: '📋 Up Next', value: remaining > 0 ? `${remaining} song(s) in queue` : 'Nothing', inline: true },
      { name: '👤 Requested by', value: song.user ? song.user.toString() : 'Unknown', inline: true }
    )
    .addFields({ name: '⏳ Progress', value: progressBar })
    .setFooter({ text: 'Elite Music Bot' })
    .setTimestamp();
}

/**
 * Returns disabled versions of all buttons (used when queue ends).
 */
function getDisabledButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('music_prev').setEmoji('⏮').setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId('music_pause').setEmoji('⏸️').setStyle(ButtonStyle.Primary).setDisabled(true),
    new ButtonBuilder().setCustomId('music_skip').setEmoji('⏭').setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId('music_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger).setDisabled(true),
    new ButtonBuilder().setCustomId('music_loop').setLabel('🔁 Off').setStyle(ButtonStyle.Secondary).setDisabled(true)
  );
}

module.exports = { getMusicButtons, getMusicButtonsRow2, getMusicEmbed, getDisabledButtons };
