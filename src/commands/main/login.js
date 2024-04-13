const { PermissionFlagsBits } = require('discord.js');
const { getGuildData } = require('../../database/schemas/Guild');
const logger = require('node-color-log');

module.exports = {
  name: 'login',
  description: 'Log your server in to recieve and send messages',

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: async (client, interaction) => {
    try {
      const loginData = await getGuildData(interaction.guild.id);
      if (loginData.guildData.status === 'online') {
        interaction.reply('Your server is already logged in!', {
          ephemeral: true,
        });
        return;
      }
      loginData.guildData.status = 'online';
      await loginData.save().catch((error) => {
        logger.error(`Error on saving data - login command: ${error}`);
      });
      interaction.reply('Your server has been logged in!', { ephemeral: true });
    } catch (error) {
      logger.error(`Error on login command: ${error}`);
      interaction.reply('An error occured while trying to log in.', {
        ephemeral: true,
      });
      return;
    }
  },
};
