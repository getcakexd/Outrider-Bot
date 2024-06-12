const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, GuildMember} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-remove')
        .setDescription('Times out all the members without administrator permission')
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false),
    async execute(interaction) {
        interaction.guild.members.fetch().then(members => {
            members.forEach(member => {
                if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    member.timeout(null).catch(error => {
                        console.log(`[WARNING] ${error.message}`);
                    });
                }
            });
        });

        await interaction.reply("Server successfully set free from lockdown");
        console.log(`Servers successfully set free from lockdown by ${interaction.user.username} (ID: ${interaction.user.id})`)
        console.log('');

    },
};