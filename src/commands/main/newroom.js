const { createRoomData } = require('../../database/schemas/Room');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { fetchChannelWebhook } = require('../../toolbox/Utils');

module.exports = {
  name: 'create-room',
  description:
    'Create a room and token for your server. Only use this on the crossover channel.',

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
    // Only create a webhook if there isn't one already
    var webhook = await fetchChannelWebhook(interaction.channel);
    const resultData = await createRoomData(
      webhook.url,
      interaction.guild.id,
      interaction.channel.id
    );
    const settings = resultData.roomData;
    settings.roomOwner = interaction.guild.name;

    const parsedSettings = Object.entries(settings).map(([key, value]) => {
      return `**${key}**: ${value}`;
    });

    processSettings(parsedSettings);

    const embed = new EmbedBuilder()
      .setTitle('Room Settings')
      .setDescription(parsedSettings.join('\n'))
      .setColor('Orange');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

function processSettings(parsedSettings) {
  parsedSettings.splice(parsedSettings.indexOf('**roomWebhooks**:'), 1);
  parsedSettings.forEach((setting, index) => {
    parsedSettings[index] = setting
      .replace('roomToken', 'Room Token')
      .replace('roomOwner', 'Room Owner')
      .replace('roomMembers', 'Room Members');
  });
}
