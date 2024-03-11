// TODO: Delete this file
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');
const { getGuildData } = require('../../database/schemas/Guild');

module.exports = {
  name: 'config-setbotchannel',
  description: 'Set the bot channel for the server',
  deteled: true,
  options: [
    {
      name: 'channel',
      description: 'The channel to set',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: async (client, interaction, args) => {
    const channel = interaction.options.getChannel('channel');
    if (!channel)
      return interaction.reply('Please provide a valid channel.', {
        ephemeral: true,
      });

    interaction.reply(`Set the bot channel to <#${channel.id}>!`, {
      ephemeral: true,
    });
  },
};
