const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
   name: 'setstatus',
   description: 'Set the server status for the chat',
   options: [
      {
         name: 'status',
         description: 'The status to set',
         type: ApplicationCommandOptionType.String,
         required: true,
         choices: [
            {
               name: 'Online',
               value: 'online'
            },
            {
               name: 'Away/Do Not Disturb',
               value: 'idle'
            },
            {
               name: 'Invisible',
               value: 'invisible'
            },
            {
               name: 'Offline',
               value: 'offline'
            },
         ]
      }
   ],
   
   requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above
   
   botPermissions: [PermissionFlagsBits.SendMessages],

   callback: async (client, interaction, args) => {
      // const status = args[0].value;
      // client.user.setStatus(status);
      // interaction.reply(`Status set to ${status}`);
   }
};