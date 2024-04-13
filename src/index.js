const { Client, Partials, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const { BOT_TOKEN } = require('../config.json');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [
    Partials.USER,
    Partials.MESSAGE,
    Partials.CHANNEL,
    Partials.GUILD_MEMBER,
    Partials.Reaction,
  ],
});

eventHandler(client);

client.login(BOT_TOKEN);
