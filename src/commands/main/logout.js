const { getGuildData } = require('../../database/schemas/Guild');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'logout',
  description: 'Log your server out to no longer recieve and send messages',

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: async (client, interaction, args) => {
    // TODO: Implement reply to textChannel if its set.
    try {
      const data = await getGuildData(interaction.guild.id);
      if (data.guildData.status === 'offline') {
        interaction.reply('Your server is already offline!');
        return;
      }
      data.guildData.status = 'offline';
      await data.save().catch((error) => {
        console.error(`Error on saving data - logout command: ${error}`);
      });
      interaction.reply('Your server has gone offline!');
    } catch (error) {
      console.error(`Error on logout command: ${error}`);
      interaction.reply('An error occured while trying to log out.');
      return;
    }
  },
};
