const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
  roomData: {
    roomToken: {
      type: String,
      required: true,
    },
    roomOwner: {
      type: String,
      required: true,
    },
    roomMembers: {
      type: Map,
      of: {
        member: String,
        webhookURL: String,
        channelId: String,
      },
      default: {},
    },
  },
});

const Model = model('Room', roomSchema);

module.exports = {
  /**
   * @param {string} guildId
   * @description Get the room data from the guildId. It catches the error and logs it to the console.
   * @returns {Promise<import('mongoose').Document>}
   */
  getRoomDataByGuildId: async (guildId) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomOwner': guildId,
      });
      if (!getRoomData) {
        return null;
      }
      return getRoomData;
    } catch (error) {
      console.error(`Error on getRoomData: ${error}`);
    }
  },

  /**
   * @param {string} roomToken
   * @description Get the room data from the roomToken. It catches the error and logs it to the console.
   * @returns {Promise<import('mongoose').Document>}
   */
  getRoomDataByToken: async (roomToken) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomToken': roomToken,
      });
      if (!getRoomData) {
        return null;
      }
      return getRoomData;
    } catch (error) {
      console.error(`Error on getRoomData: ${error}`);
    }
  },
  /**
   * @param {string} webhookURL
   * @param {string} guildId
   * @param {string} channelId
   * @description Create the room data from the guildId. It catches the error and logs it to the console.
   * @returns {Promise<import('mongoose').Document>}
   */
  createRoomData: async (webhookURL, guildId, channelId) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomOwner': guildId,
      });
      if (!getRoomData) {
        try {
          const newData = await Model.create({
            roomData: {
              roomToken:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              roomOwner: guildId,
              roomMembers: {
                [guildId]: {
                  webhookURL: webhookURL,
                  channelId: channelId,
                },
              },
            },
          });
          return newData;
        } catch (error) {
          console.error(`Error on createRoomData: ${error}`);
        }
      }
      return getRoomData;
    } catch (error) {
      console.error(`Error on createRoomData: ${error}`);
    }
  },

  /**
   * @param {string} roomToken
   * @param {string} guildId
   * @param {string} guildWebhookUrl
   * @param {string} channelId
   * @description Add a guild to the room. Returns whether the operation was a success or not. It catches the error and logs it to the console.
   * @returns {Promise<boolean>}
   */
  addGuildToRoom: async (roomToken, guildId, guildWebhookUrl, channelId) => {
    let success = false;
    try {
      const getRoomData = await Model.findOne({ roomData: { roomToken } });
      if (!getRoomData) {
        // Room hasnt been created yet
        success = false;
      }
      getRoomData.roomData.roomMembers.set(guildId, {
        webhookURL: guildWebhookUrl,
        channelId: channelId,
      });
      await getRoomData.save();
      success = true;
    } catch (error) {
      success = false;
      console.error(`Error on addGuildToRoom: ${error}`);
    }
    return success;
  },
};
