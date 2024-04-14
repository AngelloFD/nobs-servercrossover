const { getGuildData } = require('../../database/schemas/Guild');
const { PermissionFlagsBits } = require('discord.js');
const logger = require('node-color-log');

module.exports = {
  name: 'logout',
  description: 'Log your server out to no longer recieve and send messages',

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: async (client, interaction, args) => {
    try {
      const logoutData = await getGuildData(interaction.guild.id);
      if (logoutData.guildData.status === 'offline') {
        interaction.reply('Your server is already offline!', {
          ephemeral: true,
        });
        return;
      }
      logoutData.guildData.status = 'offline';
      logoutData.guildData.lastOnline = Date.now();
      await logoutData.save().catch((error) => {
        logger.error(`Error on saving data - logout command: ${error}`);
      });
      interaction.reply('Your server has gone offline!', { ephemeral: true });
    } catch (error) {
      logger.error(`Error on logout command: ${error}`);
      interaction.reply('An error occured while trying to log out.', {
        ephemeral: true,
      });
      return;
    }
  },
};
