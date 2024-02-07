const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Tests if the bot is online')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({content: 'Pong!', ephemeral: true});
    },
};