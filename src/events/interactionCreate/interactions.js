const { handleSlashCommand } = require('../../handlers/commandHandler');

module.exports = async (client, interaction) => {
  if (!interaction.guild) {
    interaction.reply('This command cannot be ran in DMs.', {
      ephemeral: true,
    });
  }

  if (interaction.isButton()) {
    switch (interaction.customId) {
      case 'confirm_continue':
        console.log('Confirmed');
        break;
      case 'reject_continue':
        console.log('Rejected');
        break;
      case 'confirm_join':
        console.log('Confirmed joining in');
        break;
      case 'reject_join':
        console.log('Rejected joining in');
        break;
      default:
        console.log('Fucky wucky uh oh DANGER DANGER OH MY GOD');
        break;
    }
  }

  if (!interaction.isCommand()) return;

  if (interaction.isChatInputCommand()) {
    handleSlashCommand(client, interaction);
  }
};
