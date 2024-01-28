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
            target.roles.add(role).catch((error) => {
                console.log(error.message);
            });
            console.log(`${target.user.username} (ID: ${target.user.id}) was given the ${role.name} role`)
            console.log('');
            await interaction.reply({
                content: `${target.user.username} was given the ${role.name} role`,
                ephemeral: true
            });
        } else {
            target.roles.remove(role).catch((error) => {
                console.log(error.message);
            });
            console.log(`${target.user.username} (ID: ${target.user.id}) lost the ${role.name} role`)
            console.log('');
            await interaction.reply({
                content: `${target.user.username} lost the ${role.name} role`,
                ephemeral: true
            });
        }
    },
};