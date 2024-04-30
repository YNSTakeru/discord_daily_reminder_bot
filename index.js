const {
  Client,
  Events,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: Object.values(GatewayIntentBits).filter(Number.isInteger),
});

client.login(process.env.BOT_TOKEN);

let everyoneIntervalId;
let members;
let mention = "";

client.once("ready", async () => {
  console.log("Ready!");

  client.guilds.cache.get(process.env.GUILD_ID).commands.create({
    name: "remind",
    description: "時刻をリマインドししましょう！",
  });

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const excludedUsers = ["replacethiswithsuggestion", "Shuzo_bot"];

  members = (await guild.members.fetch()).filter(
    (member) => !excludedUsers.includes(member.user.username)
  );

  mention = members.map((member) => `@${member.displayName}`).join(" ");

  everyoneIntervalId = setInterval(() => {
    const date = new Date();
    if (date.getHours() === 15 && date.getMinutes() === 0) {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      if (channel) channel.send(`${mention} そろそろ日報投稿の時間です〜`);
    }
  }, 60000);
});

const hoursDataList = Array.from({ length: 24 }, (v, i) => ({
  label: `${i}時`,
  value: `${i}`,
}));

const minutesDataList = Array.from({ length: 12 }, (v, i) => ({
  label: `${i * 5}分`,
  value: `${i * 5}`,
}));

const hour = new Map();
const remindUsers = new Map();
const usernames = new Map();

function createSelectMenu(customId, placeholder, options) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(menu);

  return row;
}

async function handleCommand(interaction) {
  if (interaction.commandName !== "remind") return;

  const row = createSelectMenu(
    "selectHour",
    "0時から23時の中から選んでください！",
    hoursDataList
  );

  await interaction.reply({
    content: "リマインドしたい時間を教えてください",
    components: [row],
  });
}

async function handleSelectMenu(interaction) {
  const { displayName } = interaction.member;

  if (interaction.customId === "selectHour") {
    const row = createSelectMenu(
      "selectMinute",
      "0分から55分の中から選んでください！",
      minutesDataList
    );

    hour.set(displayName, interaction.values[0]);

    await interaction.reply({
      content: "リマインドしたい分を教えてください",
      components: [row],
    });
  } else if (interaction.customId === "selectMinute") {
    const { username } = interaction.member.user;

    members = members.filter((member) => member.user.username !== username);

    mention = members.map((member) => `@${member.displayName}`).join(" ");

    remindUsers.set(username, {
      hour: +hour.get(displayName),
      minutes: +interaction.values[0],
    });
    usernames.set(username, displayName);

    const keys = [...remindUsers.keys()];

    let date = new Date();
    let newMention;
    for (const key of keys) {
      const { hour, minutes } = remindUsers.get(key);

      if (+date.getHours() === +hour && +date.getMinutes() === +minutes) {
        newMention = `@${key}`.join(" ");
      }
    }

    if (newMention) {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      if (channel) channel.send(`${newMention} そろそろ日報投稿の時間です〜`);
    }

    clearInterval(everyoneIntervalId);

    everyoneIntervalId = setInterval(() => {
      date = new Date();
      if (
        members.length > 0 &&
        date.getHours() === 22 &&
        date.getMinutes() === 0
      ) {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (channel) channel.send(`${mention} そろそろ日報投稿の時間です〜`);
      }

      const invertedMap = new Map();

      remindUsers.forEach((value, key) => {
        if (!invertedMap.has(value)) {
          invertedMap.set(value, [key]);
        } else {
          invertedMap.get(value).push(key);
        }
      });

      for (const [key, value] of invertedMap) {
        const { hour, minutes } = key;

        const newMention = value.map((v) => `@${usernames.get(v)}`).join(" ");

        if (+date.getHours() === +hour && +date.getMinutes() === +minutes) {
          const channel = client.channels.cache.get(process.env.CHANNEL_ID);
          if (channel)
            channel.send(`${newMention} そろそろ日報投稿の時間です〜`);
        }
      }
    }, 60000);

    await interaction.reply(
      `${displayName}さん、設定ありがとうございます！ ${hour.get(
        displayName
      )}時${interaction.values[0]}分にお知らせいたしますね`
    );
  }
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await handleCommand(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleSelectMenu(interaction);
  }
});
