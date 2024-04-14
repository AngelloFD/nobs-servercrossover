const {
  PermissionFlagsBits,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require('discord.js');
const { getGuildData } = require('../../database/schemas/Guild');
const { fetchChannelWebhook } = require('../../toolbox/Utils');
const { options } = require('../main/joinroom');
const logger = require('node-color-log');

module.exports = {
  name: 'set-webhook',
  description: 'Save the webhook of the crossover channel',

  options: [
    {
      name: 'webhook-url',
      description: 'The URL of the webhook',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],

  requiredPermissions: [PermissionFlagsBits.ModerateMembers], // Aimed towards server moderators and above

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.ManageWebhooks,
  ],

  callback: async (client, interaction) => {
    if (interaction.channel.name !== 'crossover-channel') {
      return interaction.reply(
        'This command can only be used in the crossover channel',
        { ephemeral: true }
      );
    }
    const guildData = await getGuildData(interaction.guild.id);
    const settings = guildData.guildData;
    if (settings.token) {
      return interaction.reply('This server already has a webhook saved!', {
        ephemeral: true,
      });
    }
    try {
      if (!interaction.options.getString('webhook-url')) {
        guildData.guildData.token = (
          await fetchChannelWebhook(interaction.channel)
        ).id;
      } else {
        const webhookURL = interaction.options.getString('webhook-url');
        guildData.guildData.token = webhookURL;
      }
      guildData.save();
    } catch (error) {
      logger.error(`Error on set-webhook command: ${error}`);
      interaction.reply('An error occured while trying to save the webhook.', {
        ephemeral: true,
      });
      return;
    }
  },
};
