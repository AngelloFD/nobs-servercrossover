// TODO: Ask for a channel to set as bot channel, set to database, success message and set the bot to only send messages to that channel
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');
const { getGuildData } = require('../../database/schemas/Guild');

module.exports = {
  name: 'config-setbotchannel',
  description: 'Set the bot channel for the server',
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
    // TODO: Implement reply to textChannel if its set.
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
