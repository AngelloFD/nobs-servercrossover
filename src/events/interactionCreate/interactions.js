const joinroom = require('../../commands/main/joinroom');
const {
  deleteRoomData,
  addGuildToRoom,
} = require('../../database/schemas/Room');
const { handleSlashCommand } = require('../../handlers/commandHandler');
const logger = require('node-color-log');

module.exports = async (client, interaction) => {
  if (!interaction.guild) {
    interaction.reply('This command cannot be ran in DMs.', {
      ephemeral: true,
    });
  }

  if (interaction.isButton()) {
    const [action, roomToken, guildId, guildWebhookUrl, channelId] =
      interaction.customId.split(':');
    switch (action) {
      case 'confirm_continue':
        // TODO: Make this delete the room data and rerun the join command or ask the token again.
        const success = await deleteRoomData(guildId);
        if (!success) {
          interaction.reply('An error occurred while deleting the room data.', {
            ephemeral: true,
          });
          return;
        }
        interaction.reply(
          'You have deleted your room and its participants. Please rerun the join command.',
          { ephemeral: true }
        );
        break;
      case 'reject_continue':
        interaction.reply('Delete cancelled.', { ephemeral: true });
        break;
      case 'confirm_join':
        await addGuildToRoom(interaction.guild.id);
        interaction.reply('We have a new server in the room. Say Hi! 😁', {
          ephemeral: true,
        });
        break;
      case 'reject_join':
        interaction.reply('Joining cancelled.', { ephemeral: true });
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
