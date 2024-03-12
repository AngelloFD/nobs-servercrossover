const { WebhookClient } = require('discord.js');
const { guildIsActive } = require('../../database/schemas/Guild');
const { getRoomData } = require('../../database/schemas/Room');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot || !guildIsActive(message.guild.id))
    return;

  const bridgeChannelName = 'crossover-channel';
  // Check if the message is in the designated channel
  if (message.channel.name === bridgeChannelName) {
    const data = await getRoomData(message.guild.id).catch((error) => {
      console.error(`Error on getRoomData: ${error}`);
    });
    if (!data) {
      message.channel.send('Room data not found');
      console.warn('Room data not found');
      return;
    }

    const roomParticipants = data.roomData.roomMembers;
    const msgRecievers = roomParticipants.filter(
      (id) => id !== message.guild.id
    );
    if (!msgRecievers) {
      message.channel.send(
        'No other servers found. Invite them to the room to start chatting.'
      );
      console.warn('No other servers found');
      return;
    }

    msgRecievers.forEach((id) => {
      const otherServer = client.guilds.cache.get(id);
      if (!otherServer) {
        message.channel.send(
          'Something happened while trying to send the message to the other server. Ensure the bot is in the server or that the server exists.'
        );
        console.warn('Server not found');
        return;
      }

      const targetChannel = otherServer.channels.cache.find(
        (channel) => channel.name === bridgeChannelName
      );
      if (!targetChannel) {
        message.channel.send(
          'The other server does not have a crossover channel'
        );
        console.warn('Crossover channel not found');
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
