function createMention(value, usernames) {
  return value.map((v) => `@${usernames.get(v)}`).join(" ");
}

module.exports = createMention;
