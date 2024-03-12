const { Schema, model } = require('mongoose');

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

const Model = model('Guild', guildSchema);

module.exports = {
  getGuildData: async (guildId) => {
    try {
      const getGuildData = await Model.findOne({ guildId: guildId });
      if (!getGuildData) {
        const newData = await Model.create({
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
      `Error on getGuildData: ${error}`;
    }
  },
  guildIsActive: async (guildId) => {
    try {
      const getGuildData = await Model.findOne({ guildId: guildId });
      return getGuildData.isActive;
    } catch (error) {
      console.error(`Error on guildIsActive: ${error}`);
    }
  },
};
