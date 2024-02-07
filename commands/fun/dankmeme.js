const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dankmeme')
        .setDescription('Sends a dank meme')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const fetch = (await import('node-fetch')).default;

            const response = await fetch("https://www.reddit.com/r/dankmemes/random/.json");
            const data = await response.json();

            if (!data || !data[0] || !data[0].data || !data[0].data.children || !data[0].data.children[0]) {
                throw new Error('Failed to fetch data');
            }

            const memeUrl = data[0].data.children[0].data.url;

            const embed = new EmbedBuilder()
                .setImage(memeUrl);

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.log('[WARNING] failed to fetch data');
            console.log(`[WARNING] ${error.message}`)
            await interaction.reply({content: 'Failed to fetch data.', ephemeral: true});
        }
    },
};
