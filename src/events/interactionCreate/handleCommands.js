const { handleSlashCommand } = require('../../handlers/commandHandler');

module.exports = async (client, interaction) => {
  if (!interaction.guild)
    return interaction.reply('This command cannot be ran in DMs.', {
      ephemeral: true,
    });

  if (interaction.isChatInputCommand()) {
    handleSlashCommand(client, interaction);
  }
};
