const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echos your massage to the channel')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Message to send')
            .setRequired(true)
        )
    ,
    async execute(interaction) {
        const message = interaction.options.getString("message");
        interaction.channel.send(message);
        await interaction.reply({content: 'Message successfully sent', ephemeral: true});
    },
};