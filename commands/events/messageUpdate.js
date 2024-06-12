module.exports = async (client, oldMessage, newMessage) => {
  const embedBuilder = require("../utils/embeds");
  const cfg = require("../../config.json");

  if (newMessage.guild.id !== cfg.guildId) return;
  if (!oldMessage.author) return;

  await client.channelLogs.messageLog.send({
    embeds: [embedBuilder.messageU(client, oldMessage, newMessage)],
  });
};
