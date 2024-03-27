//imports
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Partials} = require('discord.js');
const {token, welcomeRoleName, welcomeChannelId, moderationLogChannelId, botName} = require('./config.json');
const {version} = require('./package.json');
const { Logger } = require("term-logger");
const { readdir } = require("fs");

//client creation with intents and partials
const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildModeration,
        ],
        partials: [
            Partials.Channel,
            Partials.GuildMember,
            Partials.Message,
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.User,
            Partials.GuildMember,
            Partials.ThreadMember,
            Partials.GuildScheduledEvent
        ],
    });

//command handler
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');

const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            if (!(filePath.includes('events') || filePath.includes('utils'))) console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    // console.log(interaction);
});

//command execution
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});

//new member
client.on('guildMemberAdd', member => {

    //welcome role
    console.log(`${member.user.username} (ID: ${member.user.id}) joined the server!`);
    const role = member.guild.roles.cache.find(role => role.name === welcomeRoleName);
    member.roles.add(role).then(r => {
        console.log(`${member.user.username} (ID: ${member.user.id}) was given the ${role.name} role`);
        console.log('');
    });

    //welcome message
    const welcomeEmbed = new EmbedBuilder()
        .setColor('Random')
        .setThumbnail(member.displayAvatarURL())
        .setTitle(`Welcome to the server ${member.user.username}!`)
        .setDescription('Have a great time.')
        .setTimestamp();
    const channel = client.channels.cache.get(welcomeChannelId);
    channel.send({content: " ", embeds: [welcomeEmbed]}).catch(error => {
        console.log('[WARNING] Something happened while sending welcome message');
        console.log(`[WARNING] ${error.message}`);
    });
});

//logger
client.log = Logger;
readdir("./commands/events", (err, files) => {
    let eventFiles = files.filter((t) => t.split(".").pop() === "js");

    if (err) {
        return Logger.error(err);
    }

    eventFiles.forEach((file) => {
        let eventName = file.split(".")[0];
        let event = require(`./commands/events/${eventName}`)
        client.on(eventName, event.bind(null, client));

        Logger.event(`Successfully registered event ${eventName}.js`);
    });
});

//ready
client.once(Events.ClientReady, readyClient => {
    console.log(' ');
    console.log('------------------------------------------');
    console.log(' ');
    console.log(`${botName} v${version} is now online`);
    console.log(' ');
    console.log('------------------------------------------');
    console.log(' ');
    console.log('New events:');
    console.log(' ');
});

//login
client.login(token).catch(error => {
    console.log('[WARNING] something happened on startup');
    console.log(`[WARNING] ${error.message}`);
});