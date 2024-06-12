const {SlashCommandBuilder, PermissionFlagsBits, Guild, GuildMember} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout-revoke')
        .setDescription('Select a member to revoke the timeout on them')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to ban')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');

        if (await target.timeout(null)
            .catch((error) => {
                interaction.reply({content: `Can't revoke timeout on ${target.user.username}`, ephemeral: true});

                console.log(`[WARNING] Can't revoke timeout on ${target.user.username}`);
                console.log(`[WARNING] ${error.message}`);
                console.log("");
            })
        ) {
            await interaction.reply(`Successfully revoked timeout on ${target.user.username}`);

            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) revoked timeout on ${target.user.username} (ID: ${target.user.id})`);
            console.log(" ");
        }
    },
};
