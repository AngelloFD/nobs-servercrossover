const { Schema, model } = require('mongoose');
const logger = require('node-color-log');

const roomSchema = new Schema({
  roomData: {
    roomToken: {
      type: String,
      required: true,
    },
    roomOwnerData: {
      ownerId: {
        type: String,
        required: true,
      },
      ownerWebhookUrl: {
        type: String,
        required: true,
      },
      ownerChannelId: {
        type: String,
        required: true,
      },
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

const RoomModel = model('Room', roomSchema);

module.exports = {
  RoomModel,
  /**
   * @param {string} guildId - The id of the guild you want to get the data from
   * @description Get the room data from the guildId.
   * @returns {Promise<import('mongoose').Document> | null}
   */
  getRoomDataByGuildId: async (guildId) => {
    try {
      const getRoomData = await RoomModel.findOne({
        'roomData.roomOwnerData.ownerId': guildId,
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
   * @param {string} roomToken - The token of the room you want to get the data from
   * @description Get the room data from the roomToken.
   * @returns {Promise<import('mongoose').Document>}
   */
  getRoomDataByToken: async (roomToken) => {
    try {
      const getRoomData = await RoomModel.findOne({
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
   * @param {string} webhookURL - The webhook URL of the guild
   * @param {string} guildId  - The id of the guild
   * @param {string} channelId  - The id of the crossover channel in the guild
   * @description Create the room data from the guildId.
   * @returns {Promise<import('mongoose').Document>}
   */
  createRoomData: async (webhookURL, guildId, channelId) => {
    try {
      const getRoomData = await RoomModel.findOne({
        'roomData.roomOwnerData.ownerId': guildId,
      });
      if (!getRoomData) {
        try {
          const newData = await RoomModel.create({
            roomData: {
              roomToken:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              roomOwnerData: {
                ownerId: guildId,
                ownerWebhookUrl: webhookURL,
                ownerChannelId: channelId,
              },
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
   * @param {string} guildId  - The id of the guild
   * @description Delete the room data from the guildId.
   * @returns {Promise<boolean>}
   */
  deleteRoomData: async (guildId) => {
    try {
      const getRoomData = await RoomModel.findOne({
        'roomData.roomOwnerData.ownerId': guildId,
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
   * @param {string} roomToken  - The token of the room
   * @param {string} guildId  - The id of the guild
   * @param {string} guildWebhookUrl  - The webhook URL of the guild
   * @param {string} channelId  - The id of the crossover channel in the guild
   * @description Add a guild to the room with the token specified.
   */
  addGuildToRoom: async (roomToken, guildId, guildWebhookUrl, channelId) => {
    try {
      await RoomModel.findOneAndUpdate(
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
