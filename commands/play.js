const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song, playlist, or URL')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Search terms or URL').setRequired(true)
    ),
  async execute(interaction, distube) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });

    await interaction.deferReply();
    try {
      await distube.play(voiceChannel, query, {
        member: interaction.member,
        textChannel: interaction.channel
      });
      await interaction.editReply({
        embeds: [{
          color: 0x5865F2,
          description: `🔎 Searching and adding **${query}** to the queue...`
        }]
      });
    } catch (err) {
      console.error(err);
      const msg = err.message ? err.message.substring(0, 300) : 'Unknown error';
      await interaction.editReply({ content: `❌ Failed to play: \`${msg}\`` });
    }
  }
};