const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Expect.. the PONG!',

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
  ],

  callback: (client, interaction) => {
    // TODO: Implement reply to textChannel if its set.
    return interaction.reply(`Pong'd at ${client.ws.ping}ms!`, {
      ephemeral: true,
    });
  },
};
