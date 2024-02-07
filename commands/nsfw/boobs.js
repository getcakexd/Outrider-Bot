const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {NekoBot} = require("nekobot-api");
const api = new NekoBot();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boobs')
        .setDescription('Sends a boob pic/video')
        .setNSFW(true)
        .setDMPermission(false),
    async execute(interaction) {

        await (async () => {
            const image = await api.get("boobs");
            const embed = new EmbedBuilder().setImage(image);
            await interaction.reply({embeds: [embed]});

            console.log(`/boob command run by ${interaction.user.username} (ID: ${interaction.user.id})`);
            console.log(`Image: ${image}`);
            console.log('');
        })();
    },
};