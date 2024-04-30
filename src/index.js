const client = require("./config");
const {
  mention,
  setMention,
  startReminderInterval,
  members,
} = require("./utils/reminder");
const {
  handleCommand,
  handleSelectMenu,
} = require("./handlers/interactionHandlers");

let everyoneIntervalId;

client.once("ready", async () => {
  console.log("Ready!");

  client.guilds.cache.get(process.env.GUILD_ID).commands.create({
    name: "remind",
    description: "時刻をリマインドししましょう！",
  });

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const excludedUsers = ["replacethiswithsuggestion", "Shuzo_bot"];

  const fetchedMembers = await guild.members.fetch();
  fetchedMembers.forEach((member) => {
    if (!excludedUsers.includes(member.user.username)) {
      members.set(member.user.username, member);
    }
  });

  setMention(
    Array.from(members.values())
      .map((member) => `@${member.displayName}`)
      .join(" ")
  );

  everyoneIntervalId = startReminderInterval(17, 48);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await handleCommand(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleSelectMenu(interaction);
  }
});
