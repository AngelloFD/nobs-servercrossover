const { } = require('../../database/schemas/Room');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
   name: 'create-room',
   description: 'Create a room for your server to chat with other servers',

   requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

   botPermissions: [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.ManageWebhooks,
   ],

   callback: async (client, interaction) => {
      // TODO: Add logic to create a room  
   }
};
