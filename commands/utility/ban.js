const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to ban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (await interaction.guild.members.ban(target, {reason})
            .catch((error) => {
                interaction.reply({content: `Can't ban ${target.username}`, ephemeral: true});

                console.log(`[WARNING] Can't ban ${target.username}`);
                console.log(`[WARNING] ${error.message}`);
                console.log("");
            })
        ) {
            await interaction.reply(`Successfully banned ${target.username} for reason: ${reason}`);

            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) banned ${target.username} (ID: ${target.id}) for "${reason}"`);
            console.log(" ");
        }
    },
};
