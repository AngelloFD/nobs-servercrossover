const logger = require('node-color-log');
const {
  getRoomDataByToken,
  getRoomDataByGuildId,
  addGuildToRoom,
} = require('../../database/schemas/Room');
const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: 'join-room',
  description: 'Join a room to chat with other servers with their room token',
  options: [
    {
      name: 'token',
      description: 'The token of the room you want to join',
      required: true,
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

    // Enviar mensaje de confirmación al chat del dueño de la sala
    // con un botón de confirmar y otro de rechazar
    // Al confirmar, se añade el servidor a la sala
    // Al rechazar, se envía un mensaje de rechazo al servidor que intentó unirse
    // Vas a necesitar: el webhook del dueño de la sala, el id del canal del dueño de la sala y el mensaje de confirmación

    const confirmButton = new ButtonBuilder()
      .setCustomId(
        `confirm_join:${roomToken}:${interaction.guild.id}:${fetchChannelWebhook(interaction.channel)}:${interaction.channel.id}`
      )
      .setLabel('Confirm join')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId('reject_join')
      .setLabel('Reject join')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      confirmButton,
      rejectButton
    );

    // const webhookClient = new WebhookClient({ url:  });

    // await addGuildToRoom(
    //   interaction.guild.id,
    //   interaction.options.getString('token'),
    //   interaction.channel.id
    // );

    /*const ownerWebhook = ownerMemberData.webhookURL;
    const ownerChannelId = ownerMemberData.channelId;
    if (await getRoomDataByGuildId(interaction.guild.id)) {
      const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_continue')
        .setLabel('Confirm delete')
        .setStyle(ButtonStyle.Success);

      const rejectButton = new ButtonBuilder()
        .setCustomId('reject_continue')
        .setLabel('DON\'T DELETE!')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(
        confirmButton,
        rejectButton
      );
      interaction.reply(
        'You are already in a room. **To join another room, you will have to delete the current one with all its participants.** Are you sure you want to continue?'
      );
      interaction.channel.send({ components: [row] });
      return;
    } else if (joiningRoomData === null) {
      interaction.reply('Room not found', { ephemeral: true });
    }

    if (!roomToken) {
      return interaction.reply(
        'You need to provide a room token to join a room',
        { ephemeral: true }
      );
    }

    const confirmButton = new ButtonBuilder()
      .setCustomId(`confirm_join:${roomToken}:${interaction.guild.id}:${fetchChannelWebhook(interaction.channel)}:${interaction.channel.id}`)
      .setLabel('Confirm join')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId('reject_join')
      .setLabel('Reject join')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      confirmButton,
      rejectButton
    );

    const webhookClient = new WebhookClient({ url: ownerWebhook });
    webhookClient.send({
      content: `Server ${interaction.guild.name} wants to join your room.`,
      components: [row],
      target: ownerChannelId,
    });
    interaction.reply(
      'Request sent to the room owner. Waiting for confirmation.',
      { ephemeral: true }
    );*/
  },
};
