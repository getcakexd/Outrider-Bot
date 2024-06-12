const {SlashCommandBuilder, PermissionFlagsBits, Role} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-add')
        .setDescription('Add a role to a user')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to give to')
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role to add')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (target.roles.cache.has(role.id)) {
            interaction.reply({content: `${target.user.username} already has ${role.name}`, ephemeral: true});

        } else {
            if (await target.roles.add(role)
                .catch((error) => {
                    interaction.reply({
                        content: `${target.user.username} cant get the ${role.name} role`,
                        ephemeral: true
                    });

                    console.log(`[WARNING] ${target.user.username} cant get the ${role.name} role`);
                    console.log(`[WARNING] ${error.message}`);
                    console.log('');
                })
            ) {
                await interaction.reply({
                    content: `${target.user.username} was given the ${role.name} role`,
                    ephemeral: true
                });

                console.log(`${target.user.username} (ID: ${target.user.id}) was given the ${role.name} role`)
                console.log('');
            }
        }
    },
};