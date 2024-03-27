const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel-delete')
        .setDescription('Deletes a channel by name or id')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel you want to delete')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (await channel.delete()
            .catch(error => {
                console.log(`[WARNING] An error occurred while deleting the ${channel.name} (ID: ${channel.id}) channel`);
                console.log(`[WARNING] ${error.message}`);
                console.log('');
            })
        ) {
            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) deleted the ${channel.name} (ID: ${channel.id}) channel`)
            console.log(' ');

            await interaction.reply({content: `Successfully deleted the ${channel.name} (ID: ${channel.id}) channel`, ephemeral: true});
        }

    },
};