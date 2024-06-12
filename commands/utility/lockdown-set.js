const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, GuildMember} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-set')
        .setDescription('Times out all the members without administrator permission')
        .addStringOption(option => option
            .setName('length')
            .setDescription('Length of the lockdown (1 hour by default)')
            .addChoices(
                {name: '10 minutes', value: '600000'},
                {name: '30 minutes', value: '1800000'},
                {name: '1 hour', value: '3600000'},
                {name: '2 hours', value: '7200000'}
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the lockdown ("lockdown" by default)')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false),
    async execute(interaction) {
        let length = parseInt(interaction.options.getString('length')) ?? 3600000;
        if (isNaN(length)) length = 3600000;
        const reason = interaction.options.getString('reason') ?? 'lockdown';

        interaction.guild.members.fetch().then(members => {
            members.forEach(member => {
                if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    member.timeout(length, reason).catch(error => {
                        console.log(`[WARNING] ${error.message}`);
                    });
                }
            });
        });

        await interaction.reply(`Server successfully locked down for ${length} millisecond. Reason: ${reason}`);
        console.log(`Server successfully locked down by ${interaction.user.username} (ID: ${interaction.user.id}) for ${length} millisecond. Reason: ${reason}`);
        console.log('');

    },
};