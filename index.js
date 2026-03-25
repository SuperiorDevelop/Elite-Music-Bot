const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const config = require('./config.json');
const { getMusicButtons, getMusicButtonsRow2, getMusicEmbed, getDisabledButtons } = require('./utils/musicButtons');

// ─── Client ──────────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
  }
}

// ─── DisTube ─────────────────────────────────────────────────────────────────
const distube = new DisTube(client, {
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  ffmpeg: {
    path: require('ffmpeg-static')
  }
});

// Map: guildId → { message: Discord.Message } (the control panel message)
const controlPanels = new Map();

// ─── DisTube Events ───────────────────────────────────────────────────────────
distube
  .on('playSong', async (queue, song) => {
    console.log(`[DisTube] Now playing: ${song.name}`);
    if (!queue.textChannel) return;

    const embed = getMusicEmbed(song, queue);
    const row1 = getMusicButtons(queue);
    const row2 = getMusicButtonsRow2(queue);

    try {
      // Edit the previous panel if it exists, otherwise send a new one
      const existing = controlPanels.get(queue.id);
      let msg;
      if (existing) {
        msg = await existing.edit({ embeds: [embed], components: [row1, row2] }).catch(() => null);
      }
      if (!msg) {
        msg = await queue.textChannel.send({ embeds: [embed], components: [row1, row2] });
      }
      controlPanels.set(queue.id, msg);
    } catch (err) {
      console.error('[DisTube] playSong panel error:', err);
    }
  })

  .on('addSong', (queue, song) => {
    console.log(`[DisTube] Added: ${song.name}`);
    if (!queue.textChannel) return;
    const position = queue.songs.length - 1;
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865F2)
          .setAuthor({ name: '➕ Added to Queue' })
          .setTitle(song.name || 'Unknown')
          .setURL(song.url || null)
          .setThumbnail(song.thumbnail || null)
          .addFields(
            { name: '⏱ Duration', value: song.formattedDuration || '?', inline: true },
            { name: '📋 Position', value: position > 0 ? `#${position}` : 'Up Next', inline: true },
            { name: '👤 Requested by', value: song.user ? song.user.toString() : 'Unknown', inline: true }
          )
      ]
    }).catch(console.error);
  })

  .on('addList', (queue, playlist) => {
    if (!queue.textChannel) return;
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle(`📀 Playlist Added: ${playlist.name}`)
          .setDescription(`**${playlist.songs.length}** songs added to queue.`)
      ]
    }).catch(console.error);
  })

  .on('initQueue', (queue) => {
    queue.autoplay = false;
    queue.volume = 100;
    console.log(`[DisTube] Queue initialized for guild: ${queue.id}`);
  })

  .on('disconnect', (queue) => {
    console.log(`[DisTube] Disconnected from guild: ${queue.id}`);
    _disablePanel(queue.id);
    if (queue.textChannel) {
      queue.textChannel.send({
        embeds: [{ color: 0x5865F2, description: '👋 Disconnected from voice channel.' }]
      }).catch(console.error);
    }
    controlPanels.delete(queue.id);
  })

  .on('empty', (queue) => {
    console.log(`[DisTube] Voice channel empty, leaving...`);
  })

  .on('finish', (queue) => {
    console.log(`[DisTube] Queue finished for guild: ${queue.id}`);
    _disablePanel(queue.id);
    if (queue.textChannel) {
      queue.textChannel.send({
        embeds: [{
          color: 0x5865F2,
          title: '✅ Queue Finished',
          description: 'All songs have been played. Add more with `/play`!'
        }]
      }).catch(console.error);
    }
    controlPanels.delete(queue.id);
  })

  .on('error', (error, queue) => {
    console.error('[DisTube] Error:', error);
    if (queue && queue.textChannel) {
      const msg = error.message ? error.message.substring(0, 500) : 'Unknown error';
      queue.textChannel.send(`❌ An error occurred: \`${msg}\``).catch(console.error);
    }
  });

// Helper: disable all buttons on the control panel
async function _disablePanel(guildId) {
  const panel = controlPanels.get(guildId);
  if (!panel) return;
  try {
    await panel.edit({ components: [getDisabledButtons()] });
  } catch (_) {}
}

// Helper: refresh the control panel buttons & embed
async function _refreshPanel(guildId, queue) {
  const panel = controlPanels.get(guildId);
  if (!panel || !queue || !queue.songs.length) return;
  try {
    const embed = getMusicEmbed(queue.songs[0], queue);
    const row1 = getMusicButtons(queue);
    const row2 = getMusicButtonsRow2(queue);
    await panel.edit({ embeds: [embed], components: [row1, row2] });
  } catch (_) {}
}

// ─── Interaction Handler ──────────────────────────────────────────────────────
client.on('interactionCreate', async interaction => {
  // ── Slash Commands ──
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, distube);
    } catch (err) {
      console.error(err);
      const payload = { content: '❌ An error occurred executing that command.', ephemeral: true };
      if (!interaction.replied && !interaction.deferred) await interaction.reply(payload).catch(() => {});
      else await interaction.followUp(payload).catch(() => {});
    }
    return;
  }

  // ── Button Interactions ──
  if (!interaction.isButton()) return;

  const { customId, guildId } = interaction;

  // Music control buttons
  const MUSIC_BUTTONS = ['music_pause', 'music_skip', 'music_stop', 'music_loop', 'music_prev', 'music_shuffle', 'music_voldown', 'music_volup'];
  if (MUSIC_BUTTONS.includes(customId)) {
    const queue = distube.getQueue(guildId);
    if (!queue) {
      return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });
    }

    // Only allow users in the same voice channel
    const vc = interaction.member?.voice?.channel;
    const botVc = interaction.guild.members.me?.voice?.channel;
    if (!vc || (botVc && vc.id !== botVc.id)) {
      return interaction.reply({ content: '❌ You must be in the same voice channel as the bot.', ephemeral: true });
    }

    try {
      await interaction.deferUpdate();

      switch (customId) {
        case 'music_pause':
          if (queue.paused) queue.resume();
          else queue.pause();
          break;

        case 'music_skip':
          try { await queue.skip(); } catch (_) {
            // If nothing to skip to, stop
            await queue.stop();
          }
          break;

        case 'music_stop':
          await queue.stop();
          await _disablePanel(guildId);
          controlPanels.delete(guildId);
          return;

        case 'music_loop': {
          // Cycle: 0 (off) → 1 (song) → 2 (queue) → 0
          const next = (queue.repeatMode + 1) % 3;
          queue.setRepeatMode(next);
          break;
        }

        case 'music_prev':
          try { await queue.previous(); } catch (_) {
            await interaction.followUp({ content: '❌ No previous song available.', ephemeral: true }).catch(() => {});
          }
          break;

        case 'music_shuffle':
          if (queue.songs.length > 1) queue.shuffle();
          break;

        case 'music_voldown':
          queue.setVolume(Math.max(queue.volume - 10, 1));
          break;

        case 'music_volup':
          queue.setVolume(Math.min(queue.volume + 10, 100));
          break;
      }

      // Refresh the control panel with updated state
      await _refreshPanel(guildId, queue);
    } catch (err) {
      console.error('[Button] Error:', err);
      await interaction.followUp({ content: '❌ Something went wrong.', ephemeral: true }).catch(() => {});
    }
    return;
  }

  // Queue pagination buttons are handled by the collector in queue.js
});

// ─── Ready ────────────────────────────────────────────────────────────────────
client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📋 Loaded ${client.commands.size} commands`);
});

client.login(config.token);
module.exports = { distube };