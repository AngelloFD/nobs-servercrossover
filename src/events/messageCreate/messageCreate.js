const { BOT_PREFIX } = require('../../../config.json');
const { handlePrefixCommand } = require('../../handlers/commandHandler');

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  if (message.content.includes(`${client.user.id}`)) {
    return message.channel.send(`My prefix is \`${BOT_PREFIX}\``);
  } else if (message.content && message.content.startsWith(BOT_PREFIX)) {
    handlePrefixCommand(client, message);
  }
};
