const {SlashCommandBuilder, GuildMember, EmbedBuilder} = require('discord.js');
const { nsfwRoleName } = require('./../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nsfw-help')
        .setDescription('Lists the nsfw commands')
        //.setNSFW(true)
        .setDMPermission(false),
    async execute(interaction) {
        const nsfwRole = interaction.member.guild.roles.cache.find(role => role.name === nsfwRoleName)

        if (interaction.member.roles.cache.has(nsfwRole.id)) {
            let nsfwHelpEmbed = new EmbedBuilder()
                .setColor("#e31956")
                .setTitle("Hey! I'm here to help.")
                .setDescription("Nsfw command list")
                .addFields(
                    {
                        name: '/nsfw `confirmation`',
                        value: 'Give yourself nsfw rank, or remove it'
                    },
                    {
                        name: `/butt`,
                        value: 'Sends a butt pic'
                    },
                    {
                        name: `/boobs`,
                        value: 'Sends a boob pic'
                    },
                    {
                        name: `/pussy`,
                        value: 'Sends a pussy pic'
                    },
                );

            await interaction.reply({content: " ", embeds: [nsfwHelpEmbed], ephemeral: true})
        } else {
            await interaction.reply({content: "You don't have the role to use this command", ephemeral: true})
        }

    },
};