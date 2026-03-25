# 🎵 Elite-Music-Bot
Elite Music Bot is a feature-rich Discord bot built for performance and quality. Enjoy crystal-clear audio, responsive controls, and a seamless music experience tailored for your community.

<br>

## ✨ Features

- 🎧 **Multi-source playback** — YouTube, Spotify playlists, SoundCloud, and any direct URL via yt-dlp
- 🎛️ **Audio filters** — Bass Boost, Nightcore, Vaporwave, 8D Audio
- 🖱️ **Interactive button panel** — Auto-shown control panel with ⏮ ⏸ ⏭ ⏹ 🔁 🔀 🔉 🔊 buttons on every song
- 📋 **Paginated queue** — Browse your queue with Previous/Next page buttons
- 🔁 **Loop modes** — Off → Song → Queue cycling
- 🔊 **Volume control** — Set precise volume or use ±10 step buttons
- ⏩ **Seek support** — Jump to any timestamp in the current song

<br>

## 📦 Installation:
### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and in your system PATH
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- (Optional) Spotify API credentials for Spotify support

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/elite-music-bot.git
cd elite-music-bot

# 2. Install dependencies
npm install

# 3. Configure the bot
# Edit config.json with your credentials (see Configuration section below)

# 4. Deploy slash commands
node deploy-commands.js

# 5. Start the bot
node index.js
```
## ⚙️ Configuration

Edit `config.json` before starting the bot:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_PRIMARY_GUILD_ID",
  "guildIds": [
    "GUILD_ID_1",
    "GUILD_ID_2"
  ]
}
```

<br>

## 🤖 Commands

### ▶️ Playback

| Command | Description |
|--------|-------------|
| `/play <query>` | Play a song, playlist, or URL (YouTube, Spotify, SoundCloud) |
| `/pause` | Pause the current song |
| `/resume` | Resume a paused song |
| `/skip` | Skip to the next song in queue |
| `/stop` | Stop playback and clear the queue |
| `/leave` | Disconnect the bot from the voice channel |
| `/seek <seconds>` | Jump to a specific position in the current song |

### 📋 Queue

| Command | Description |
|--------|-------------|
| `/queue` | View the current queue (paginated, 10 songs per page) |
| `/nowplaying` | Show the currently playing song with the button control panel |
| `/shuffle` | Shuffle all songs in the queue |

### ⚙️ Settings

| Command | Description |
|--------|-------------|
| `/volume <1–100>` | Set the playback volume |
| `/loop <off \| song \| queue>` | Set the repeat mode |
| `/filter <preset>` | Apply an audio filter (see below) |

### 🎛️ Audio Filters

| Preset | Effect |
|--------|--------|
| `bassboost` | 🔈 Boosts bass frequencies |
| `nightcore` | 🌙 Speeds up pitch for Nightcore effect |
| `vaporwave` | 🌊 Slows down pitch for Vaporwave effect |
| `8d` | 🎧 Simulated 8D spatial audio |
| `clear` | ✨ Removes all active filters |

### ℹ️ General

| Command | Description |
|--------|-------------|
| `/help` | Show all commands and button controls |

<br>

## 🎮 Button Controls

Every time a new song starts, an interactive control panel is automatically posted in the text channel:

| Button | Action |
|--------|--------|
| ⏮ | Play previous song |
| ⏸ / ▶️ | Pause / Resume |
| ⏭ | Skip to next song |
| ⏹ | Stop and clear queue |
| 🔁 | Cycle loop mode (Off → Song → Queue) |
| 🔀 | Shuffle the queue |
| 🔉 | Decrease volume by 10% |
| 🔊 | Increase volume by 10% |

> 💡 You must be in the **same voice channel** as the bot to use button controls.

<br>

## 📁 Project Structure

```
elite/
├── commands/
│   ├── filter.js       # Audio filter command
│   ├── help.js         # Help menu
│   ├── leave.js        # Disconnect bot
│   ├── loop.js         # Loop mode toggle
│   ├── nowplaying.js   # Now playing embed
│   ├── pause.js        # Pause playback
│   ├── play.js         # Play a song/playlist
│   ├── queue.js        # Paginated queue viewer
│   ├── resume.js       # Resume playback
│   ├── seek.js         # Seek to timestamp
│   ├── shuffle.js      # Shuffle queue
│   ├── skip.js         # Skip song
│   ├── stop.js         # Stop and clear
│   └── volume.js       # Set volume
├── utils/
│   ├── musicButtons.js # Button rows & music embed builder
│   └── progressBar.js  # Song progress bar utility
├── config.json         # Bot credentials (do not commit!)
├── deploy-commands.js  # Slash command registration script
├── index.js            # Bot entry point
└── package.json
```

<br>

## 🛠️ Dependencies

| Package | Purpose |
|---------|---------|
| `discord.js` v14 | Discord API client |
| `distube` v5 | Music streaming engine |
| `@distube/yt-dlp` | YouTube & general URL support via yt-dlp |
| `@distube/spotify` | Spotify playlist/track support |
| `@distube/soundcloud` | SoundCloud support |
| `ffmpeg-static` | Audio encoding (bundled FFmpeg) |
| `opusscript` | Opus audio encoder for voice |

<br>

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

<br>

## 👑 Author

Made with ❤️ by SuperiorDevelop
