
module.exports = async (client, oldMessage, newMessage) => {
  const embedBuilder = require("../utils/embeds");
  const cfg = require("../../config.json");

  try {
    if (newMessage.guild.id !== cfg.guildId) return;
    if (newMessage.author.bot) return;
    if (!oldMessage.author) return
  } catch (exeption) {
    console.log(`[ERROR] An error occurred while managing events`)
    console.log(`[ERROR] ${exeption}`)
    console.log(" ")
  }

  await client.channelLogs.messageLog.send({
    embeds: [embedBuilder.messageU(client, oldMessage, newMessage)],
  });
};
