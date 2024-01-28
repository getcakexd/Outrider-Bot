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
        const options = await interaction.options.data;
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

        let poll = new EmbedBuilder().setTitle(`${options[0].value}`).setColor("Random");
        for (let i = 1; i < options.length; i++) {
            let option = options[i];
            let emoji = emojis[i - 1];
            poll.addFields(
                {
                    name: `${emoji} ${option.value}`,
                    value: ' '
                }
            )
        }

        const message = await interaction.channel.send({embeds: [poll]});
        for (let i = 1; i < options.length; i++) {
            let emoji = emojis[i - 1];
            await message.react(emoji);
        }
        await interaction.editReply({content: 'Poll successfully created'})

        let pollData = `Title: ${options[0].value} \nOptions: `;
        for (let i = 1; i < options.length; i++) {
            pollData += `${i}: ${options[i].value}; `;
        }
        console.log(`${interaction.user.username} (ID: ${interaction.user.id}) created a poll.`);
        console.log(pollData);
        console.log(" ");
    },
};

