const { WebhookClient } = require('discord.js');
const { guildIsActive } = require('../../database/schemas/Guild');
const { getRoomDataByGuildId } = require('../../database/schemas/Room');
const logger = require('node-color-log');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot || !guildIsActive(message.guild.id))
    return console.log('Ignoring message');

  const bridgeChannelName = 'crossover-channel';
  // Check if the message is in the designated channel
  if (message.channel.name === bridgeChannelName) {
    const data = await getRoomDataByGuildId(message.guild.id);
    if (!data) {
      message.channel.send('Room data not found');
      logger.warn('Room data not found');
      return;
    }

    const roomParticipants = data.roomData.roomMembers;
    // roomParticipants is a Map
    const msgRecievers = Array.from(roomParticipants.keys()).filter(
      (id) => id !== message.guild.id
    );
    console.log(msgRecievers);
    if (!msgRecievers) {
      message.channel.send(
        'No other servers found. Invite them to the room to start chatting.'
      );
      logger.warn('No other servers found');
      return;
    }

    msgRecievers.forEach((id) => {
      const otherServer = client.guilds.cache.get(id);
      if (!otherServer) {
        message.channel.send(
          'Something happened while trying to send the message to the other server. Ensure the bot is in the server or that the server exists.'
        );
        logger.warn('Server not found');
        return;
      }

      const targetChannel = otherServer.channels.cache.find(
        (channel) => channel.name === bridgeChannelName
      );
      if (!targetChannel) {
        message.channel.send(
          'The other server does not have a crossover channel'
        );
        logger.warn('Crossover channel not found');
        return;
      }

      const webhookClient = new WebhookClient({});
      webhookClient.send({
        content: message.content,
        username: message.author.username + ' from ' + message.guild.name,
        avatarURL: message.author.displayAvatarURL(),
        allowedMentions: { parse: [] },
        target: targetChannel,
      });
      webhookClient.destroy();
    });
  } else {
    return;
  }
};
