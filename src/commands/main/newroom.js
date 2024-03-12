const { createRoomData } = require('../../database/schemas/Room');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

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
    // TODO: Test this command
    if (interaction.channel.name !== 'crossover-channel') {
      return interaction.reply(
        'This command can only be used in the crossover channel',
        { ephemeral: true }
      );
    }
    // Only create a webhook if there isn't one already
    var webhook = await interaction.channel
      .fetchWebhooks()
      .then((webhooks) => {
        return webhooks.first();
      })
      .catch((error) => {
        console.error(`Error on fetching webhooks: ${error}`);
      });
    if (webhook === undefined) {
      var webhook = await interaction.channel
        .createWebhook({
          channel: interaction.channel.id,
          name: 'Room Webhook',
          reason: 'Room webhook creation',
        })
        .catch((error) => {
          console.error(`Error on creating webhook command: ${error}`);
        });
    }
    console.log(webhook);
    const resultData = await createRoomData(webhook.url, interaction.guild.id);
    console.log(resultData);
    const settings = resultData.roomData;
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
      .replace('roomMembers', 'Room Members');
  });
}
