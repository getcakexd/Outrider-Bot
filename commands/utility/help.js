const {EmbedBuilder, MessageEmbed, SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('lists the commands')
    ,
    async execute(interaction) {
        let embed;
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            embed = createModHelpEmbed()
        } else {
            embed = createUserHelpEmbed();
        }
        await interaction.reply({content: " ", embeds: [embed], ephemeral: true})

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
                name: `/invite`,
                value: 'Creates a invite for this channel'
            },
            {
                name: `/help`,
                value: 'Lists all the commands'
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
                name: `/role`,
                value: 'Adds/removes the chosen role to/from the tagged member'
            },
            {
                name: `/delete`,
                value: 'Deletes the given amount of messages in the channel'
            },
            {
                name: `/dm`,
                value: 'Send a direct message to the tagged person'
            },
            {
                name: `/echo`,
                value: 'Echos the given message to the channel'
            },
            {
                name: `/poll`,
                value: 'Create a poll with up to 6 options'
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
        );
}