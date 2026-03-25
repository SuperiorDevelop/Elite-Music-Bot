/**
 * Builds a Unicode text progress bar.
 * @param {number} current - current position in seconds
 * @param {number} total   - total duration in seconds
 * @param {number} size    - bar width in characters (default 20)
 * @returns {string} e.g. "▓▓▓▓▓░░░░░░░░░░░░░░░  1:23 / 3:45"
 */
function buildProgressBar(current, total, size = 20) {
  if (!total || total <= 0) return '░'.repeat(size) + '  0:00 / Live';
  const progress = Math.min(current / total, 1);
  const filled = Math.round(size * progress);
  const empty = size - filled;
  const bar = '▓'.repeat(filled) + '░'.repeat(empty);
  return `\`${bar}\` ${formatTime(current)} / ${formatTime(total)}`;
}

/**
 * Format seconds into MM:SS or HH:MM:SS
 */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

module.exports = { buildProgressBar, formatTime };
