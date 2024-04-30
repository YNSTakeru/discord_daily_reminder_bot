const client = require("./config");
const { startReminderInterval } = require("./utils/reminder");
const { handleInteraction } = require("./handlers/interactionHandlers");
const setBotCommand = require("./utils/setBotCommand");
const fetchMembers = require("./utils/fetchMembers");

async function initializeBot() {
  console.log("Ready!");
  await setBotCommand();
  await fetchMembers();
  everyoneIntervalId = startReminderInterval(18, 45);
}

client.once("ready", initializeBot);
client.on("interactionCreate", handleInteraction);
