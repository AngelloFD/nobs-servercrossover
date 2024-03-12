const {} = require('../../database/schemas/Room');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'join-room',
  description: 'Join a room to chat with other servers with their room token',

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.ManageWebhooks,
  ],

  callback: async (client, interaction) => {
    // TODO: Add logic to join a room. This should also send a message to the room owner to accept the request
  },
};
