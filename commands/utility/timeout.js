const {SlashCommandBuilder, PermissionFlagsBits, Guild, GuildMember} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Select a member and time them out for the given time.')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to ban')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('length')
            .setDescription('The length of the timeout in minutes')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('length-measure')
            .setDescription('Measurement of length')
            .addChoices(
                {name: 'Minutes', value: '60000'},
                {name: 'Hours', value: '3600000'},
                {name: 'Days', value: '86400000'},
                {name: 'Revoke', value: '0'}
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const measureNumber = parseInt(interaction.options.getString('length-measure'));
        const length = interaction.options.getNumber('length');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        let measure;
        if (measureNumber === 60000) {
            measure = 'minute(s)';
        } else if (measureNumber === 3600000) {
            measure = 'hour(s)';
        } else {
            measure = 'days(s)'
        }
        const lengthMilliseconds = length * measureNumber;


        if (length === 0) {
            if (await target.timeout(null)
                .catch((error) => {
                    interaction.reply({content: `Can't revoke timeout on ${target.user.username}`, ephemeral: true});

                    console.log(`Can't revoke timeout on ${target.user.username}`);
                    console.log(error.message);
                    console.log("");
                })
            ) {
                await interaction.reply(`Successfully revoked timeout ${target.user.username} reason: ${reason}`);

                console.log(`${interaction.user.username} (ID: ${interaction.user.id}) revoked timeout on ${target.user.username} (ID: ${target.user.id}) reason: "${reason}"`);
                console.log(" ");
            }
        } else {
            if (await target.timeout(lengthMilliseconds, reason)
                .catch((error) => {
                    interaction.reply({content: `Can't timeout ${target.user.username}`, ephemeral: true});

                    console.log(`Can't timeout ${target.user.username}`);
                    console.log(error.message);
                    console.log("");
                })
            ) {
                await interaction.reply(`Successfully timed out ${target.user.username} for ${length} ${measure} reason: ${reason}`);

                console.log(`${interaction.user.username} (ID: ${interaction.user.id}) timed out ${target.user.username} (ID: ${target.user.id}) for ${length} ${measure} reason: "${reason}"`);
                console.log(" ");
            }
        }
    },
};
