const {SlashCommandBuilder, GuildMember, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Gives you the nsfw role')
        .addStringOption(option => option
            .setName('confirmation')
            .setDescription('Type "confirm" to get the nsfw role or write "remove" to lose it')
        )
        // .setNSFW(true)
        .setDMPermission(false),
    async execute(interaction) {
        const confirmation = interaction.options.getString('confirmation');
        const nsfwRole = interaction.member.guild.roles.cache.find(role => role.name.toLowerCase() === "nsfw")
        if (!confirmation) {
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

        } else if (confirmation === 'confirm') {
            if (interaction.member.roles.cache.has(nsfwRole.id)) {
                await interaction.reply({content: `You already have the ${nsfwRole.name} role`, ephemeral: true});

            } else {
                if (await interaction.member.roles.add(nsfwRole)
                    .catch((error) => {
                        interaction.reply({content: "Something went wrong", ephemeral: true})

                        console.log('[WARNING] something went wrong while using /nsfw');
                        console.log(`[WARNING] ${error.message}`);
                        console.log("");
                    })
                ) {
                    await interaction.reply({content: `You just gave yourself ${nsfwRole.name} role`, ephemeral: true});

                    console.log(`${interaction.user.username} (ID: ${interaction.user.id}) just gave themself the ${nsfwRole.name} role`);
                    console.log("");
                }

            }

        } else if (confirmation === 'remove') {
            if (!interaction.member.roles.cache.has(nsfwRole.id)) {
                await interaction.reply({content: `You doesn't have the ${nsfwRole.name} role`, ephemeral: true});

            } else {
                if (await interaction.member.roles.remove(nsfwRole)
                    .catch((error) => {
                        interaction.reply({content: "Something went wrong", ephemeral: true})

                        console.log('something went wrong while using /nsfw');
                        console.log(error.message);
                        console.log("");
                    })
                ) {
                    await interaction.reply({
                        content: "You just removed the nsfw role from yourself ",
                        ephemeral: true
                    });

                    console.log(`${interaction.user.username} (ID: ${interaction.user.id}) just removed the nsfw role from themself`);
                    console.log("");
                }
            }
        } else {
            await interaction.reply({
                content: 'You must type "confirm" to get the nsfw role or write "remove" to lose it',
                ephemeral: true
            });

        }
    },
};