const client = require("../config");

function sendReminder(channelId, mention) {
  const channel = client.channels.cache.get(channelId);
  if (channel) channel.send(`${mention} そろそろ日報投稿の時間です〜`);
}

module.exports = sendReminder;
