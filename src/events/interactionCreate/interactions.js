const joinroom = require('../../commands/main/joinroom');
const {
  deleteRoomData,
  addGuildToRoom,
} = require('../../database/schemas/Room');
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
        // TODO: Make this delete the room data and rerun the join command or ask the token again.
        await deleteRoomData(interaction.guild.id);
        interaction.reply('You have deleted your room and its participants. Please rerun the join command.', { ephemeral: true });
        break;
      case 'reject_continue':
        interaction.reply('Delete cancelled.', { ephemeral: true });
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
