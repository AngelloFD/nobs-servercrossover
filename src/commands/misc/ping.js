module.exports = {
   name: 'ping',
   description: 'Expect.. the PONG!',
   deleted: false,
   callback: (client, interaction) => {
      interaction.reply(`Pong'd at ${client.ws.ping}ms!`, { ephemeral: true });
   }
}