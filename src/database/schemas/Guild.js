const { Schema, model } = require('mongoose');
const logger = require('node-color-log');

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  guildData: {
    status: String,
    token: String,
    isActive: Boolean,
    joinedAt: Date,
    lastOnline: Date,
  },
});

const GuildModel = model('Guild', guildSchema);

module.exports = {
  /**
   * @param {String} guildId  - The guild ID to get the data from
   * @description Get the guild data from the guildId.
   * @returns {Promise<import('mongoose').Document> | null}
   */
  getGuildData: async (guildId) => {
    try {
      const getGuildData = await GuildModel.findOne({ guildId: guildId });
      if (!getGuildData) {
        const newData = await GuildModel.create({
          guildId: guildId,
          guildData: {
            status: 'offline',
            token: null,
            isActive: true,
            joinedAt: Date.now(),
            lastOnline: null,
          },
        });
        return newData;
      }
      return getGuildData;
    } catch (error) {
      logger.error(`Error on getGuildData: ${error}`);
    }
  },

  /**
   * @param {String} guildId - The guild ID to check if it's active
   * @description Function to retrieve the guild's active status
   * @returns {Promise<Boolean>}
   */
  guildIsActive: async (guildId) => {
    try {
      const getGuildData = await GuildModel.findOne({ guildId: guildId });
      return getGuildData.isActive;
    } catch (error) {
      logger.error(`Error on guildIsActive: ${error}`);
    }
  },
};
