const cfg = require("../../config.json");
module.exports = async (client, message) => {
  const embedBuilder = require("../utils/embeds");
  const cfg = require("../../config.json");

  try {
    if (message.guild.id !== cfg.guildId) return;
    if (message.author.bot) return;
  } catch (exeption) {
      console.log(`[ERROR] An error occurred while managing events`)
      console.log(`[ERROR] ${exeption}`)
      console.log(" ")
  }

  await client.channelLogs.messageLog.send({
    embeds: [embedBuilder.messageD(client, message)],
  });
};
