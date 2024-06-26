const { EmbedBuilder } = require('discord.js');
const {
  getGuildData: registerGuild,
  guildIsActive,
} = require('../../database/schemas/Guild');
const logger = require('node-color-log');

/**
 * @param {*} client
 * @param {*} guild
 * @description This event allows the bot to save the guild's info to the database and send a welcome message to the server's system channel or the first text channel it finds.
 */
module.exports = async (client, guild) => {
  if (!guild.available) return;
  try {
    const getGuildData = await registerGuild(guild.id);
    if (guildIsActive(guild.id) === false) {
      getGuildData.isActive = true;
      await getGuildData.save().catch((error) => {
        `Error on saving data - guildCreate: ${error}`;
      });
    }
    logger.info(`New guild joined: ${guild.name}`);
    const embed = new EmbedBuilder()
      .setTitle('Hello! 👋')
      .setDescription(
        "Thank you for inviting me to your server! I am a bot designed to expand the server's interaction with other communities. To get started, type `/help` to see all the commands I offer."
      )
      .setColor('Random')
      .setTimestamp();
    if (guild.systemChannel) {
      return guild.systemChannel.send({ embeds: [embed] });
    } else {
      const channel = guild.channels.cache.find(
        (channel) => channel.type === 'GUILD_TEXT'
      );
      if (channel && channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
        channel.send({ embeds: [embed] });
      } else {
        const owner = await guild.fetchOwner().catch((error) => {
          logger.error(`Error on fetchOwner: ${error}`);
        });
        owner.send({ embeds: [embed] });
      }
    }
  } catch (error) {
    logger.error(`Error on guildCreate: ${error}`);
  }
};
