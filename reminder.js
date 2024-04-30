const client = require("./config");
let mention = "";
const hourMap = new Map();
const members = new Map();
const remindUsers = new Map();
const usernames = new Map();

function setMention(value) {
  mention = value;
}

function sendReminder(channelId, mention) {
  const channel = client.channels.cache.get(channelId);
  if (channel) channel.send(`${mention} そろそろ日報投稿の時間です〜`);
}

function startReminderInterval(hour, minute) {
  return setInterval(() => {
    const date = new Date();

    if (
      members.size > 0 &&
      date.getHours() === hour &&
      date.getMinutes() === minute
    ) {
      sendReminder(process.env.CHANNEL_ID, mention);
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
        sendReminder(process.env.CHANNEL_ID, newMention);
      }
    }
  }, 60000);
}

module.exports = {
  setMention,
  sendReminder,
  startReminderInterval,
  hourMap,
  members,
  remindUsers,
  usernames,
};
