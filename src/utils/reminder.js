const createInvertedMap = require("./createInvertedMap");
const createMention = require("./createMention");
const sendReminder = require("./sendReminder");

const usernames = new Map();
let mention = "";
const hourMap = new Map();
const members = new Map();
const remindUsers = new Map();

function setMention(value) {
  mention = value;
}

function startReminderInterval(hour, minute) {
  return setInterval(() => {
    const date = new Date();
    const currentHour = date.getHours();
    const currentMinute = date.getMinutes();

    if (members.size > 0 && currentHour === hour && currentMinute === minute) {
      sendReminder(process.env.CHANNEL_ID, mention);
    }

    const invertedMap = createInvertedMap(remindUsers);

    for (const [key, value] of invertedMap) {
      const { hour, minutes } = key;

      const newMention = createMention(value, usernames);

      if (currentHour === +hour && currentMinute === +minutes) {
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
