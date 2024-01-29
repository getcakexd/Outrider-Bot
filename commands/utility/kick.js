const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
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

        if (await interaction.guild.members.kick(target)
            .catch((error) => {
                interaction.reply({content: `Can't kick ${target.username}`, ephemeral: true});

                console.log(`Can't kick ${target.username}`);
                console.log(error.message);
                console.log("");
            })
        ) {
            await interaction.reply(`Successfully kicked ${target.username} for reason: ${reason}`);

            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) kicked ${target.username} (ID: ${target.id}) for "${reason}"`);
            console.log(" ");
        }
    },
};