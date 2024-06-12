module.exports = async (client, message) => {
  const embedBuilder = require("../utils/embeds");
  const cfg = require("../../config.json");

  if (message.guild.id !== cfg.guildId) return;

  await client.channelLogs.messageLog.send({
    embeds: [embedBuilder.messageD(client, message)],
  });
};
