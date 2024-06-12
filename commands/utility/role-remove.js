const {SlashCommandBuilder, PermissionFlagsBits, Role} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-remove')
        .setDescription('Remove a role from a user')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to remove from')
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role to remove')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (!target.roles.cache.has(role.id)) {
            interaction.reply({content: `${target.user.username} doesn't have ${role.name}`, ephemeral: true});

        } else {
            if (await target.roles.remove(role)
                .catch((error) => {
                    interaction.reply({
                        content: `${target.user.username} cant lose the ${role.name} role`,
                        ephemeral: true
                    });

                    console.log(`[WARNING] ${target.user.username} cant lose the ${role.name} role`);
                    console.log(`[WARNING] ${error.message}`);
                    console.log('');
                })
            ) {
                await interaction.reply({
                    content: `${target.user.username} lost the ${role.name} role`,
                    ephemeral: true
                });

                console.log(`${target.user.username} (ID: ${target.user.id}) lost the ${role.name} role`)
                console.log('');
            }
        }
    },
};