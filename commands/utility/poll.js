const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll')
        .addStringOption(option => option
            .setName('title')
            .setDescription('Title for the poll')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('option1')
            .setDescription('Option 1 of 6')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('option2')
            .setDescription('Option 2 of 6')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('color')
            .setDescription('choose a color (Random by default)')
            .addChoices(
                {name: 'Red', value: '#FF0000'},
                {name: 'Green', value: '#00FF00'},
                {name: 'Blue', value: '#0000FF'},
                {name: 'Yellow', value: '#FFFF00'},
                {name: 'Cyan', value: '#00FFFF'},
                {name: 'Magenta', value: '#FF00FF'},
                {name: 'Gray', value: '#808080'},
                {name: 'Brown', value: '#A52A2A'},
                {name: 'Orange', value: '#FFA500'},
                {name: 'Pink', value: '#FFC0CB'},
                {name: 'Purple', value: '#800080'},
                {name: 'Lime', value: '#00FF00'},
                {name: 'Random', value: 'Random'},
            )
        )
        .addStringOption(option => option
            .setName('option3')
            .setDescription('Option 3 of 6')
            .setMaxLength(50)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('option4')
            .setDescription('Option 4 of 6')
            .setMaxLength(50)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('option5')
            .setDescription('Option 5 of 6')
            .setMaxLength(50)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('option6')
            .setDescription('Option 6 of 6')
            .setMaxLength(50)
            .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        let options = await interaction.options.data;
        let color = interaction.options.getString('color');
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
        let optionsLength = options.length;

        let poll = new EmbedBuilder().setTitle(`${options[0].value}`).setColor(color);
        for (let i = 1; i < optionsLength; i++) {
            let option = options[i];
            if (option.name === 'color') {
                optionsLength--;
                continue;
            }
            let emoji = emojis[i - 1];
            poll.addFields(
                {
                    name: `${emoji} ${option.value}`,
                    value: ' '
                }
            )
        }

        const message = await interaction.channel.send({embeds: [poll]});
        for (let i = 1; i < optionsLength; i++) {
            let emoji = emojis[i - 1];
            await message.react(emoji);
        }
        await interaction.editReply({content: 'Poll successfully created'})

        let pollData = `Title: ${options[0].value} \nOptions: `;
        for (let i = 1; i < options.length; i++) {
            if (options[i].name === 'color') {
                optionsLength--;
                continue;
            }
            pollData += `${i}: ${options[i].value}; `;
        }
        console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a poll.`);
        console.log(pollData);
        console.log(" ");
    },
};

