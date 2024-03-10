const { WebhookClient } = require('discord.js');
const { guildIsActive } = require('../../database/schemas/Guild');

module.exports = async (client, message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!guildIsActive(message.guild.id)) return;

  const bridgeChannelName = 'crossover-channel';
  // Check if the message is in the designated channel
  if (message.channel.name === bridgeChannelName) {
    const otherServerId =
      message.guild.id === '828989782465839107'
        ? '1189698827825987614'
        : '828989782465839107';
    const otherServer = client.guilds.cache.get(otherServerId);
    if (!otherServer) return console.log('Other server not found');

    const targetChannel = otherServer.channels.cache.find(
      (channel) => channel.name === bridgeChannelName
    );
    if (!targetChannel) return console.log('Target channel not found');

    // TODO: Recolect webhook ID and token for the servers and use them for communication after pairing the servers' token
    const webhookClient = new WebhookClient({
      id: '1212593463271493703',
      token:
        'H1EXTHTjs5LkmHHLLlAkEsRloyBFRNJcVWaEW5Y2ENaZ8zteybDtzyks60EBMTz6XVc6',
    });
    webhookClient.send({
      content: message.content,
      username: message.author.username + ' from ' + message.guild.name,
      avatarURL: message.author.displayAvatarURL(),
      allowedMentions: { parse: [] },
      target: targetChannel,
    });
    webhookClient.destroy();
  } else {
    return;
  }
};
