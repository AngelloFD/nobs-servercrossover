const { EmbedBuilder } = require('discord.js');
const {
  getGuildData: registerGuild,
  guildIsActive,
} = require('../../database/schemas/Guild');

/**
 * @param {*} client
 * @param {*} guild
 * @description This event allows the bot to save the guild's info to the database and send a welcome message to the server's system channel or the first text channel it finds.
 */
module.exports = async (client, guild) => {
  if (!guild.available) return;
  try {
    const data = await registerGuild(guild.id);
    if (guildIsActive(guild.id) === false) {
      data.isActive = true;
      await data.save().catch((error) => {
        `Error on saving data - guildCreate: ${error}`;
      });
    }
    console.info(`New guild joined: ${guild.name}`);
    const embed = new EmbedBuilder()
      .setTitle('Hello! 👋')
      .setDescription(
        "Thank you for inviting me to your server! I am a bot designed to expand the server's interaction with other communities. To get started, type `/help` to see all the commands I offer."
      )
      .setColor('Random')
      .setTimestamp();
    if (data.textChannel !== null) {
      const channel = guild.channels.cache.get(data.textChannel);
      if (!channel) return guild.systemChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error(`Error on guildCreate: ${error}`);
  }
};
