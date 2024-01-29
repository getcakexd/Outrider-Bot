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

        if (await interaction.channel.bulkDelete(amount)
            .catch((error) => {
                interaction.reply({content: "Unable to delete the messages", ephemeral: true})

                console.log("Unable to delete the messages");
                console.log(error.message);
                console.log('');
            })
        ) {
            await interaction.reply({content: `Successfully deleted ${amount} messages`, ephemeral: silent});

            console.log(`${amount} messages has been deleted by ${interaction.user.username} (ID: ${interaction.user.id})`);
            console.log(" ");
        }


    }
};