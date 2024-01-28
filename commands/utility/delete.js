const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('deletes the last messages of the given amount')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('amount opf messages to be deleted')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('silent')
            .setDescription('whether to send a confirmation reply or not ')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');
        const silent = interaction.options.getBoolean('silent');

        interaction.channel.bulkDelete(amount);
        await interaction.reply({content: `Successfully deleted ${amount} messages`, ephemeral: silent});

        console.log(`${amount} messages has been deleted by ${interaction.user.username} (ID: ${interaction.user.id})`);
        console.log(" ");
    }
};