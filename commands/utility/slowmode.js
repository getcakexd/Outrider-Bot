const {SlashCommandBuilder, PermissionFlagsBits, GuildChannelTypes, GuildChannel, GuildChannelManager} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Make a channel slowmode by name,id or all')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel you want to be made slowmode')
            .addChannelTypes(0)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('seconds')
            .setDescription('Interval between messages in seconds')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the slowmode')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute(interaction) {
        let channel = interaction.options.getChannel('channel');
        const seconds = interaction.options.getNumber('seconds');
        let reason = interaction.options.getString('reason') || 'No reason given';

        if (await channel.setRateLimitPerUser(seconds, reason)
            .catch(error =>{
                console.log(`[WARNING] An error occurred while slowmoding the ${channel.name} (ID: ${channel.id}) channel`);
                console.log(`[WARNING] ${error.message}`);
                console.log('');
            })
        ) {
            console.log(`${interaction.user.username} (ID: ${interaction.user.id} slowmoded the ${channel.name} (ID: ${channel.id}) channel for ${seconds} seconds`);
            console.log(' ');

            await interaction.reply({content: `You successfully slowmoded <#${channel.id}> for ${seconds} seconds`, ephemeral: true});
        }

    }
};