const {EmbedBuilder, MessageEmbed, SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('lists the commands')
        .setDMPermission(false),
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const modEmbed = createModHelpEmbed();
            const embed = createUserHelpEmbed();
            await interaction.reply({content: " ", embeds: [embed], ephemeral: true})
            await interaction.followUp({content: " ", embeds: [modEmbed], ephemeral: true})
        } else {
            const embed = createUserHelpEmbed();
            await interaction.reply({content: " ", embeds: [embed], ephemeral: true})
        }

        console.log(`${interaction.user.username} (ID: ${interaction.user.id}) used /help`)
    },
};

function createModHelpEmbed() {
    return new EmbedBuilder()
        .setColor("#e31956")
        .setTitle("Hey! I'm here to help.")
        .setDescription("Command list for administrators")
        .setAuthor({name: "Outrider Knight#3668"})
        .addFields(
            {
                name: `/echo`,
                value: 'Echos the given message to the channel'
            },
            {
                name: `/dm`,
                value: 'Send a direct message to the tagged person'
            },
            {
                name: `/ticket`,
                value: 'Take, close or delete a ticket'
            },
            {
                name: `/kick`,
                value: 'Kicks the tagged member'
            },
            {
                name: `/ban`,
                value: 'Bans the tagged member for the given reason'
            },
            {
                name: `/timeout`,
                value: 'Times out the tagged member for the given given amount of time with the given reason'
            },
            {
                name: '/lockdown',
                value: 'Times out every user for the given amount of time'
            },
            {
                name: `/role`,
                value: 'Adds/removes the chosen role to/from the tagged member'
            },
            {
                name: `/delete`,
                value: 'Deletes the given amount of messages in the channel'
            },
            {
                name: `/channel-delete`,
                value: 'Delete a channel by name or id'
            },
            {
                name: `/channel-create`,
                value: 'Create a new channel'
            },
        );
}

function createUserHelpEmbed() {
    return new EmbedBuilder()
        .setColor("#00ff0b")
        .setTitle("Hey! I'm here to help.")
        .setDescription("Command list for users")
        .setAuthor({name: "Outrider Knight#3668"})
        .addFields(
            {
                name: `/ping`,
                value: 'Check if the bot is online'
            },
            {
                name: `/invite`,
                value: 'Creates a invite for this channel'
            },
            {
                name: `/help`,
                value: 'Lists all the commands'
            },
            {
                name: `/poll`,
                value: 'Create a poll with up to 6 options'
            },
            {
                name: `/meme`,
                value: 'Sends a random meme'
            },
            {
                name: `/dankmeme`,
                value: 'Sends a random dank meme'
            },
            {
                name: `/ticket-create`,
                value: 'Creates a dedicated ticket for your problem'
            },
            {
                name: `/nsfw`,
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
}