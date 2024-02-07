const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('DM-ing the mentioned user')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to send the message')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('message')
            .setDescription('The message to send')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const message = interaction.options.getString('message');

        target.send(message)
            .catch(async (error) => {
                console.log(`[WARNING] Something went wrong while trying to dm ${target.user.username} (ID: ${target.user.id})`);
                console.log(`[WARNING] ${error.message}`);
                console.log('');
            });

        await interaction.reply({content: `Message successfully sent to ${target.user.username}`, ephemeral: true});
        console.log(`Sent a dm to ${target.user.username} (ID: ${target.user.id}) by ${interaction.user.username} (ID: ${interaction.user.id})`);
        console.log(" ");
    },
};
