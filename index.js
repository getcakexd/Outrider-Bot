//imports
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Partials} = require('discord.js');
const {token, welcomeRoleName, welcomeChannelId, moderationLogChannelId, botName} = require('./config.json');
const {version} = require('./package.json');

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
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
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

//audit logs
function sendLogEmbed(embed) {
    const logChannel = client.channels.cache.get(moderationLogChannelId);
    logChannel.send({content: " ", embeds: [embed]}).catch(error => {
        console.log('[WARNING] Something happened while sending welcome message');
        console.log(`[WARNING] ${error.message}`);
    });
}

//channels
client.on("channelCreate", (channel) => {
    let types = {
        2: "Voice Channel",
        0: "Text Channel",
        5: "Announcement Channel",
        4: "Category",
        13: "Stage",
        15: "Forum"
    }
    let embed = new EmbedBuilder()
        .setDescription(`A New Channel Has Been Created!!\n\nChannel; ${channel}\nChannel ID; ${channel.id}\nChannel Type; ${types[channel.type]}`)
        .setColor("#00FF00")

    sendLogEmbed(embed);

})
client.on("channelDelete", (channel) => {
    let types = {
        2: "Voice Channel",
        0: "Text Channel",
        5: "Announcement Channel",
        4: "Category",
        13: "Stage",
        15: "Forum"
    }
    let embed = new EmbedBuilder()
        .setDescription(`A Channel Has Been Deleted!\n\nChannel; ${channel.name}\nChannel ID; ${channel.id}\nChannel Type; ${types[channel.type]}`)
        .setColor("#ff0000")

    sendLogEmbed(embed);
})
client.on("channelUpdate", (oldChannel, newChannel) => {
    let types = {
        2: "Voice Channel",
        0: "Text Channel",
        5: "Announcement Channel",
        4: "Category",
        13: "Stage",
        15: "Forum"
    }
    if (oldChannel.name !== newChannel.name) {
        let embed = new EmbedBuilder()
            .setDescription(`Name of the ${oldChannel} channel was updated!\n\nOld name: ${oldChannel.name}\nNew name: ${newChannel.name}`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else if (oldChannel.type !== newChannel.type) {
        let embed = new EmbedBuilder()
            .setDescription(`Type of the ${oldChannel} channel was changed!\n\nOld types; ${types[oldChannel.type]}\nNew types; ${types[newChannel.type]}`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else {
        let embed = new EmbedBuilder()
            .setDescription(`Updated on ${oldChannel}, But Not Detected What Has Been Done!`)
            .setColor("#ff0000")
        sendLogEmbed(embed);
    }
});
client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
    let embed = new EmbedBuilder()
        .setDescription(`${channel} - (\`${channel.id}\`) Channel's Permissions Updated!`)
        .setColor("#FFFF00")
    sendLogEmbed(embed);
});
client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    let embed = new EmbedBuilder()
        .setDescription(`${channel} - (\`${channel.id}\`) Channel's Topic Updated!`)
        .setColor("#FFFF00")
    sendLogEmbed(embed);
});
client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
    let embed = new EmbedBuilder()
        .setDescription(`${oldChannel} The Channel Has Been Updated, But What Has Been Detected!`)
        .setColor("#FFFF00")
    sendLogEmbed(embed);
});
//emojis
client.on("emojiCreate", (emoji) => {
    let embed = new EmbedBuilder()
        .setDescription(`A New Emoji Has Been Created!\n\nEmoji; ${emoji}\nEmoji ID; ${emoji.id}\nEmoji URL; [Click](${emoji.url})`)
        .setColor("#00FF00")
        .setThumbnail(`${emoji.url}`)
    sendLogEmbed(embed);
});
client.on("emojiDelete", (emoji) => {
    let embed = new EmbedBuilder()
        .setDescription(`An Emoji Has Been Deleted!\n\nEmoji; ${emoji.name}\nEmoji ID; ${emoji.id}\nEmoji URL; [Click](${emoji.url})`)
        .setColor("#ff0000")
        .setThumbnail(`${emoji.url}`)
    sendLogEmbed(embed);
});
client.on("emojiUpdate", (oldEmoji, newEmoji) => {
    if (oldEmoji.name !== newEmoji.name) {
        let embed = new EmbedBuilder()
            .setDescription(`The Name of the ${oldEmoji} Emoji has been Updated!\n\nOld Name; ${oldEmoji.name}\nNew name; ${newEmoji.name}\nEmoji URL; [Click](${newEmoji.url})`)
            .setColor("#FFFF00")
            .setThumbnail(`${newEmoji.url}`)
        sendLogEmbed(embed);
    }
});
//guild and users
client.on("guildMemberRoleAdd", (member, role) => {
    let embed = new EmbedBuilder()
        .setDescription(`${member} (\`${member.id}\`) Has Been Given ${role} (\`${role.id}\`)!`)
        .setColor("#800080")
    sendLogEmbed(embed);
});
client.on("guildMemberRoleRemove", (member, role) => {
    let embed = new EmbedBuilder()
        .setDescription(`${role} (\`${role.id}\`) Has Been Taken From ${member} (\`${member.id}\`)!`)
        .setColor("#800080")
    sendLogEmbed(embed);
});
client.on("guildMemberEntered", (member) => {
    let embed = new EmbedBuilder()
        .setDescription(`${member} - ${member.user.tag} Passed Through Server Gate!`)
        .setColor("#800080")
    sendLogEmbed(embed);
});
client.on("userFlagsUpdate", (user, oldFlags, newFlags) => {
    let embed = new EmbedBuilder()
        .setDescription(`${user} - ${user.tag} User's Badge Updated!`)
        .setColor("#800080")
        .setThumbnail(`${user.avatarURL({dynamic: true})}`)
    sendLogEmbed(embed);
});
client.on("guildMemberBoost", (member) => {
    let embed = new EmbedBuilder()
        .setDescription(`${member} - ${member.user.tag} Boost on our server!`)
        .setColor("#FFC0CB")
    sendLogEmbed(embed);
});
client.on("guildMemberUnboost", (member) => {
    let embed = new EmbedBuilder()
        .setDescription(`${member} - ${member.user.tag} Has Taken Boost On Our Server!`)
        .setColor("#FFFF00")
    sendLogEmbed(embed);
});
client.on("guildFeaturesUpdate", (oldGuild, newGuild) => {
    let embed = new EmbedBuilder()
        .setDescription(`Updated On The Server!\n\nOld Settings; ${oldGuild.features.join(", ")}\nNew Settings; ${newGuild.features.join(", ")}`)
        .setColor("#FFFF00")
        .setThumbnail(`${newGuild.iconURL({dynamic: true})}`)
    sendLogEmbed(embed);
});
client.on("guildPartnerAdd", (guild) => {
    let embed = new EmbedBuilder()
        .setDescription(`The Server Became a Discord Partner!`)
        .setColor("#00ff00")
    sendLogEmbed(embed);
});
client.on("unhandledGuildUpdate", (oldGuild, newGuild) => {
    let embed = new EmbedBuilder()
        .setDescription(`An Update Has Been Made On The Server, But What Has Been Detected!`)
        .setColor("#FFFF00")
        .setThumbnail(`${newGuild.iconURL({dynamic: true})}`)
    sendLogEmbed(embed);
});
//messages
client.on("messageContentEdited", (message, oldContent, newContent) => {
    let embed = new EmbedBuilder()
        .setDescription(`Edited a Message Content!\n\nMessage Owner; ${message.member}\nOld Message Content; ${oldContent}\nNew Message Content; ${newContent}`)
        .setColor("#FFA500")
        .setThumbnail(`${message.member.user.avatarURL({dynamic: true})}`)
    sendLogEmbed(embed);
});
client.on("messageDelete", async (messageDelete) => {
    if (messageDelete.author == null || messageDelete.content == null) return;
    let embed = new EmbedBuilder()
        .setDescription(`A message has been Deleted\n\nMessage Owner; ${messageDelete.author}\nMessage Content; ${messageDelete.content}\nChannel; ${messageDelete.channel}`)
        .setColor("#ff0000")

    sendLogEmbed(embed);
});
client.on("messageDeleteBulk", async (messageDeleteBulk) => {
    if (messageDeleteBulk.size == null) return;
    let embed = new EmbedBuilder()
        .setDescription(`${messageDeleteBulk.size} messages has been deleted\n\n Messages:`)
        .setColor("#ff0000")

    try {
        for (let message of messageDeleteBulk.values()) {
            let content = message.content;
            if (message.embeds.length !== 0) {
                content = '[Embed]'
            }
            embed.addFields(
                {
                    name: ' ',
                    value: content
                },
            )
        }
    } catch (error) {
        console.log("[WARNING] Error occurred while making an embed");
        console.log(`[WARNING] ${error.message}`);
        console.log('');
    }

    sendLogEmbed(embed);
});
//roles
client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
    let embed = new EmbedBuilder()
        .setDescription(`${role} - (\`${role.id}\`) Role Permissions Updated!`)
        .setColor("#FFFF00")
    sendLogEmbed(embed);
});
client.on("roleUpdate", (oldRole, newRole) => {
    if (oldRole.name !== newRole.name) {
        let embed = new EmbedBuilder()
            .setDescription(`${oldRole} Role Name Updated!\n\nOld Name; ${oldRole.name}\nNew Name; ${newRole.name}`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else if (oldRole.position !== newRole.position) {
        let embed = new EmbedBuilder()
            .setDescription(`${oldRole} Role Position Updated!\n\nOld Position; ${oldRole.position}\nNew Position; ${newRole.position}`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else if (oldRole.hexColor !== newRole.hexColor) {
        let embed = new EmbedBuilder()
            .setDescription(`${oldRole} Role Color Updated!!\n\nOld Color; ${oldRole.hexColor}\nNew Color; ${newRole.hexColor}`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else if (oldRole.icon !== newRole.icon) {
        let embed = new EmbedBuilder()
            .setDescription(`${oldRole} Role Icon Updated!\n\nOld Icon; [Click!](${oldRole.iconURL})\nNew Icon; [Click!](${newRole.iconURL})`)
            .setColor("#FFFF00")
        sendLogEmbed(embed);
    } else {
        let embed = new EmbedBuilder()
            .setDescription(`${oldRole} Role Has Been Updated, But What Has Been Detected!`)
            .setColor("#ff0000")
        sendLogEmbed(embed);
    }
});
client.on("roleCreate", (role) => {
    let embed = new EmbedBuilder()
        .setDescription(`A New Role Has Been Created!\n\nRole; ${role}\nRole ID; ${role.id}`)
        .setColor("#00FF00")
    sendLogEmbed(embed);
});
client.on("roleDelete", (role) => {
    let embed = new EmbedBuilder()
        .setDescription(`An Role Has Been Deleted\n\nRole; ${role.name}\nRole ID; ${role.id}\nRole Color; ${role.color}`)
        .setColor("#ff0000")
    sendLogEmbed(embed);
});