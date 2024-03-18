const { SlashCommandBuilder } = require('discord.js');
const { botName } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the current uptime of the bot.'),

    async execute(interaction) {
        const totalSeconds = (interaction.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        await interaction.reply({content: `${botName} has been up for: ${uptime}`, ephemeral: true});
    },
};
