const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('sending a channel invite')
        .addNumberOption(option => option
            .setName('length')
            .setDescription("The lifetime of the invite in hours")
        )
        .addNumberOption(option => option
            .setName("uses")
            .setDescription("Maximal use of the invite")
        )
        .addBooleanOption(option => option
            .setName("temp")
            .setDescription("Granting temporary membership if true")
        ),
    async execute(interaction) {
        const maxAge = interaction.options.getNumber("length") * 3600 || 86400;
        const maxUses = interaction.options.getNumber("uses") || 1;
        const temp = interaction.options.getBoolean("temp") || false;

        const invite = await interaction.channel.createInvite({
            maxAge: maxAge,
            maxUses: maxUses,
            unique: true,
            temporary: temp

        }).catch(error => {
            console.log(`[WARNING] ${interaction.user.globalName} (ID: ${interaction.user.id}) tried to generate a invite to ${interaction.channel} but was unsuccessful`)
            console.log(`[WARNING] ${error.message}`);
            console.log(" ");
        });

        console.log(`${interaction.user.globalName} (ID: ${interaction.user.id}) generated a invite to ${interaction.channel}`);
        console.log(`The link ${invite}`);
        console.log(" ");
        await interaction.reply(`Here is your invite: ${invite} \n It can be used ${maxUses} time(s)`);
    },
};