const {SlashCommandBuilder, ChannelType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel-create')
        .setDescription('Creates a channel')
        .addStringOption(option => option
            .setName('name')
            .setDescription('name of the new channel')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('type')
            .setDescription('type of the channel')
            .addChoices(
                {name: 'Text', value: '0'},
                {name: 'Voice', value: '2'},
                {name: 'Category', value: '4'},
                {name: 'Stage', value: '13'},
                {name: 'Forum', value: '15'},
                {name: 'Announcement', value: '5'},
            )
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('locked')
            .setDescription('True if the channel should be locked')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('category-name')
            .setDescription('Name of the category you want this channel to be in')
        )
        .addStringOption(option => option
            .setName('category-id')
            .setDescription('Id of the category you want this channel to be in')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const type = interaction.options.getString('type');
        const locked = interaction.options.getBoolean('locked');
        const parentName = interaction.options.getString('category-name');
        const parentId = interaction.options.getString('category-id');
        let channel;

        if (parentId) {
            let parent = await interaction.guild.channels.cache.find(channel => channel.id === parentId);
            if (parent !== null) {
                channel = await parent.children.create({name: name, type: type})
                    .catch(error => {
                        console.log('[WARNING] An error occurred while creating a new channel');
                        console.log(`[WARNING] ${error.message}`);
                        console.log('');
                    });
                if (locked) {
                    await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {ViewChannel: false})
                }

                interaction.reply({content: 'channel successfully created', ephemeral: true});
                console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a new channel`);
                console.log(`Channel name and id: ${channel.name} (ID: ${channel.id}); Category name: ${parent.name}; Type: ${type}`);
                console.log('');
            } else {
                interaction.reply({content: `There is no category with this id: ${parentId}`, ephemeral: true});
            }

        } else if (parentName) {
            let parent = await interaction.guild.channels.cache.find(channel => channel.name.toLowerCase().includes(parentName.toLowerCase())) || null;
            if (parent !== null) {
                channel = await parent.children.create({name: name, type: type})
                    .catch(error => {
                        console.log('[WARNING] An error occurred while creating a new channel');
                        console.log(`[WARNING] ${error.message}`);
                        console.log('');
                    });
                if (locked) {
                    await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {ViewChannel: false})
                }

                interaction.reply({content: 'channel successfully created', ephemeral: true});
                console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a new channel`);
                console.log(`Channel name and id: ${channel.name} (ID: ${channel.id}); Category name: ${parent.name}; Type: ${type}`);
                console.log('');
            } else {
                interaction.reply({content: `There is no category named: ${parentName}`, ephemeral: true});
            }

        } else {
            channel = interaction.guild.channels.create({name: name, type: type});
            if (locked) {
                await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {ViewChannel: false});
            }

            interaction.reply({content: 'channel successfully created', ephemeral: true});
            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a new channel`);
            console.log(`Channel name and id: ${channel.name} (ID: ${channel.id}); Type: ${type}`);
            console.log('');
        }
    },
};