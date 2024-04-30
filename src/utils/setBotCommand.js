const client = require("../config");

async function setBotCommand() {
  client.guilds.cache.get(process.env.GUILD_ID).commands.create({
    name: "remind",
    description: "時刻をリマインドししましょう！",
  });
}

module.exports = setBotCommand;
