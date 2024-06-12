const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('take, close or delete a ticket')
        .addStringOption(option => option
            .setName('method')
            .setDescription('Choose whether you want to take, close or delete this ticket')
            .addChoices(
                {name: 'take', value: 'take'},
                {name: 'close', value: 'close'},
                {name: 'delete', value: 'delete'}
            )
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute(interaction) {
        const method = await interaction.options.getString('method');
        const channel = await interaction.channel;

        if (method === 'take') {
            const newChannelName = channel.name + '-' + interaction.user.username;

            channel.send(`<@${interaction.member.id}> took this ticket. They will help you with your issue.`);
            channel.setName(newChannelName);

            await interaction.reply({content: 'You successfully took this ticket', ephemeral: true});
            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) took ${channel.name}`);
            console.log('');

        } else if (method === 'close') {
            channel.send(`This ticket has been closed.`);
            interaction.guild.members.fetch().then(members => {
                members.forEach(member => {
                    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        const memberPermissions = channel.permissionsFor(member);
                        const canSeeChannel = memberPermissions && memberPermissions.has(PermissionsBitField.Flags.ViewChannel);

                        if (canSeeChannel) {
                            channel.permissionOverwrites.delete(member);
                            throw new Error('BreakException');
                        }
                    }
                });
            }).catch(_ => null);

            await interaction.reply({content: 'You successfully closed this ticket', ephemeral: true});
            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) closed ${channel.name}`);
            console.log('');

        } else if (method === 'delete') {
            if (!channel.name.startsWith('ticket')) {
                await interaction.reply({content: 'This is not a ticket. Use /channel-delete', ephemeral: true});
            } else {
                await interaction.reply({content: 'You successfully deleted this ticket', ephemeral: true}).then(() => {
                    channel.delete();
                });
                console.log(`${interaction.user.username} (ID: ${interaction.user.id}) deleted ${channel.name}`);
                console.log('');
            }
        }

    },
};