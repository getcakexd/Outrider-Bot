const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel-delete')
        .setDescription('Deletes a channel by name or id')
        .addStringOption(option => option
            .setName('method')
            .setDescription('Choose between deleting a channel by name, id or this one')
            .addChoices(
                {name: 'by id', value: 'id'},
                {name: 'by name', value: 'name'},
                {name: 'this one', value: 'this'}
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription('Id of the channel to be deleted')
        )
        .addStringOption(option => option
            .setName('name')
            .setDescription('Full or partial name of the channel to be deleted')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute(interaction) {
        const method = interaction.options.getString('method');
        if (method === 'this') {
            await interaction.reply({content: 'Successfully deleted this channel', ephemeral: true});

            interaction.channel.delete();
        } else if (method === 'id') {
            const id = interaction.options.getString('id');

            if (id) {
                let channel = await interaction.guild.channels.cache.find(channel => channel.id === id);
                await interaction.reply({content: 'Successfully deleted the channel', ephemeral: true});

                channel.delete();
            } else {
                await interaction.reply({content: 'You have to provide the id of the channel', ephemeral: true});
            }

        } else if (method === 'name') {
            const name = interaction.options.getString('name');
            if (name) {
                let channel = await interaction.guild.channels.cache.find(channel => channel.name.toLowerCase().includes(name.toLowerCase()));
                await interaction.reply({content: 'Successfully deleted the channel', ephemeral: true});

                channel.delete();
            } else {
                await interaction.reply({
                    content: 'You have to provide a part or the full name of the channel',
                    ephemeral: true
                });
            }
        }
    },
};