const {
  startReminderInterval,
  mention,
  hourMap,
  members,
  remindUsers,
  usernames,
  setMention,
} = require("./reminder");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const hoursDataList = Array.from({ length: 24 }, (v, i) => ({
  label: `${i}時`,
  value: `${i}`,
}));

const minutesDataList = Array.from({ length: 12 }, (v, i) => ({
  label: `${i * 5}分`,
  value: `${i * 5}`,
}));

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

    hourMap.set(displayName, interaction.values[0]);

    await interaction.reply({
      content: "リマインドしたい分を教えてください",
      components: [row],
    });
  } else if (interaction.customId === "selectMinute") {
    const { username } = interaction.member.user;

    members.delete(username);

    setMention(
      Array.from(members.values())
        .map((member) => `@${member.displayName}`)
        .join(" ")
    );

    remindUsers.set(username, {
      hour: +hourMap.get(displayName),
      minutes: +interaction.values[0],
    });
    usernames.set(username, displayName);

    await interaction.reply(
      `${displayName}さん、設定ありがとうございます！ ${hourMap.get(
        displayName
      )}時${interaction.values[0]}分にお知らせいたしますね`
    );
  }
}

module.exports = { handleCommand, handleSelectMenu };