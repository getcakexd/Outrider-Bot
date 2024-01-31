const {SlashCommandBuilder, PermissionFlagsBits, Role} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove a role to a user')
        .addStringOption(option => option
            .setName('method')
            .setDescription('Choosing add or remove')
            .setRequired(true)
            .addChoices(
                {name: 'add', value: 'add'},
                {name: 'remove', value: 'remove'},
            )
        )
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to give to/remove from')
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription('Name of the role to add/remove')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const method = interaction.options.getString('method');
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');
        if (method === 'add') {
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
        } else {
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
        }
    },
};