const { getGuildData } = require('../../database/schemas/Guild');
const logger = require('node-color-log');
module.exports = async (client, guild) => {
  const guildId = guild.id;
  await getGuildData(guildId)
    .then(async (data) => {
      data.guildData.isActive = false;
      await data.save();
    })
    .catch((error) => {
      `Error on guildDelete event: ${error}`;
    });

  logger.warn(`Left guild: ${guild.name} (id: ${guild.id})`);
};
