const { Schema, model } = require('mongoose');
const logger = require('node-color-log');

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
      logger.error(`Error on getRoomData: ${error}`);
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
      logger.error(`Error on getRoomData: ${error}`);
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
          logger.error(`Error on createRoomData: ${error}`);
        }
      }
      return getRoomData;
    } catch (error) {
      logger.error(`Error on createRoomData: ${error}`);
    }
  },

  /**
   * @param {string} guildId
   * @description Delete the room data from the guildId. It catches the error and logs it to the console.
   * @returns {Promise<boolean>}
   */
  deleteRoomData: async (guildId) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomOwner': guildId,
      });
      if (!getRoomData) {
        return false;
      }
      await getRoomData.deleteOne().catch((error) => {
        logger.error(`Error while deleting data on deleteRoomData: ${error}`);
      });
      return true;
    } catch (error) {
      logger.error(`Error on deleteRoomData: ${error}`);
    }
  },

  /**
   * @param {string} roomToken
   * @param {string} guildId
   * @param {string} guildWebhookUrl
   * @param {string} channelId
   * @description Add a guild to the room with the token specified. It catches the error and logs it to the console.
   * @returns {Promise<boolean>}
   */
  addGuildToRoom: async (roomToken, guildId, guildWebhookUrl, channelId) => {
    try {
      const getRoomData = await Model.findOneAndUpdate(
        {
          'roomData.roomToken': roomToken,
        },
        {
          $set: {
            [`roomData.roomMembers.${guildId}`]: {
              webhookURL: guildWebhookUrl,
              channelId: channelId,
            },
          },
        }
      );
    } catch (error) {
      logger.error(`Error on addGuildToRoom: ${error}`);
    }
  },
};
