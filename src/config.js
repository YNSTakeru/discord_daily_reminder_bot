const { Client, GatewayIntentBits } = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: Object.values(GatewayIntentBits).filter(Number.isInteger),
});

client.login(process.env.BOT_TOKEN);

module.exports = client;
