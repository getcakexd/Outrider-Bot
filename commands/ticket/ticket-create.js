const {SlashCommandBuilder, ChannelType, GuildChannel} = require('discord.js');
const {ticketCategoryName} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-create')
        .setDescription('Creates a ticket')
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Give the reason for opening a ticket')
            .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        const reason = interaction.options.getString('reason');

        let ticketCategory = await interaction.guild.channels.cache.find(channel => channel.name === ticketCategoryName) || null;
        if (ticketCategory === null) {
            ticketCategory = await interaction.guild.channels.create({
                name: ticketCategoryName,
                type: ChannelType.GuildCategory,
            });
            await ticketCategory.permissionOverwrites.create(interaction.guild.roles.everyone, {ViewChannel: true});
        }

        let channelName = 'ticket-' + Math.floor(Math.random() * 10000).toString();
        let channel = await ticketCategory.children.create({name: channelName, type: ChannelType.GuildText});
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {ViewChannel: false});
        await channel.permissionOverwrites.create(interaction.member, {ViewChannel: true});

        channel.send(`Ticket created by <@${interaction.user.id}>.`)
        channel.send(`Reason: ${reason}`);
        channel.send(`Wait for an admin to take your ticket`);

        console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a ticket for: ${reason}`);
        console.log('');

        await interaction.reply({content: `Ticket created. Your ticket: ${channelName}`, ephemeral: true});
    },
};