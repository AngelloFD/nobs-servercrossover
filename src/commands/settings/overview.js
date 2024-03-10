const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildData } = require('../../database/schemas/Guild');

module.exports = {
  name: 'config-overview',
  description: "Show all settings for the bot's functionality in the server",

  requiredPermissions: [], // Aimed towards anyone

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: async (client, interaction) => {
    // TODO: Implement reply to textChannel if its set.
    try {
      const guildData = await getGuildData(interaction.guild.id);
      const settings = guildData.guildData;
      const parsedSettings = Object.entries(settings).map(([key, value]) => {
        return `**${key}**: ${value}`;
      });

      processSettings(parsedSettings);

      const embed = new EmbedBuilder()
        .setTitle('Server Settings Overview')
        .setDescription(parsedSettings.join('\n'))
        .setColor('Green');

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(`Error on overview command: ${error}`);
      await interaction.reply({
        content: 'An error occurred while retrieving server settings.',
        ephemeral: true,
      });
    }
  },
};

function processSettings(parsedSettings) {
  parsedSettings.splice(parsedSettings.indexOf('**isActive**: true'), 1);
  parsedSettings.splice(parsedSettings.indexOf('**joinedAt**:'), 1);
  parsedSettings.splice(parsedSettings.indexOf('**lastOnline**:'), 1);

  // rename the keys to be more human readable
  parsedSettings.forEach((setting, index) => {
    parsedSettings[index] = setting
      .replace('status', 'Status')
      .replace('token', 'Webhook Token')
      .replace('textChannel', "Bot's Text Channel");
  });
}
