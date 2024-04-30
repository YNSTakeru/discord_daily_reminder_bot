const client = require("../config");
const { setMention, members } = require("./reminder");

async function fetchMembers() {
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
}

module.exports = fetchMembers;
