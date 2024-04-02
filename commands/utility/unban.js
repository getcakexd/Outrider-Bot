const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member by id')
        .addStringOption(option => option
            .setName('id').
            setDescription('id of the user to be un banned')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const id = interaction.options.getString('id');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const ban = await interaction.guild.bans.fetch(id)
            .catch((error) => {
                interaction.reply({content: `Can't find banned user with ${id} id`, ephemeral: true});

                console.log(`[WARNING] Can't find banned user with ${id} id`);
                console.log(`[WARNING] ${error.message}`);
                console.log("");
            });
        const target = await ban.user.fetch()
            .catch((error) => {
                interaction.reply({content: `Can't fetch banned user with ${id} id`, ephemeral: true});

                console.log(`[WARNING] Can't fetch banned user with ${id} id`);
                console.log(`[WARNING] ${error.message}`);
                console.log("");
            });

        if (await interaction.guild.members.unban(target)
            .catch((error) => {
                interaction.reply({content: `Can't unban ${target.username}`, ephemeral: true});

                console.log(`[WARNING] Can't unban ${target.username}`);
                console.log(`[WARNING] ${error.message}`);
                console.log("");
            })
        ) {
            await interaction.reply(`Successfully unbanned ${target.username} for reason: ${reason}`);

            console.log(`${interaction.user.username} (ID: ${interaction.user.id}) unbanned ${target.username} (ID: ${target.id}) for "${reason}"`);
            console.log(" ");
        }
    },
};
