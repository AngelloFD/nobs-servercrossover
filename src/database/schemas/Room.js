const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
  roomData: {
    roomToken: {
      type: String,
      required: true,
    },
    roomMembers: [
      {
        type: String,
        default: [],
      },
    ],
    roomWebhooks: [
      {
        type: String,
        default: [],
      },
    ],
  },
});

const Model = model('Room', roomSchema);

module.exports = {
  /**
   * @param {string} guildId
   * @description Get the room data from the guildId. It catches the error and logs it to the console.
   * @returns {Promise<import('mongoose').Document>}
   */
  getRoomData: async (guildId) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomMembers': guildId,
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
   * @description Create the room data from the guildId. It catches the error and logs it to the console.
   * @returns {Promise<import('mongoose').Document>}
   */
  createRoomData: async (webhookURL, guildId) => {
    try {
      const getRoomData = await Model.findOne({
        'roomData.roomMembers': guildId,
      });
      if (!getRoomData) {
        try {
          const newData = await Model.create({
            roomData: {
              roomToken:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              roomMembers: [guildId],
              roomWebhooks: [webhookURL],
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
   * @param {string} otherGuildId
   * @param {string} otherGuildWebhookURL
   * @description Add a guild to the room. Returns whether the operation was a success or not. It catches the error and logs it to the console.
   * @returns {Promise<boolean>}
   */
  addGuildToRoom: async (roomToken, otherGuildId, otherGuildWebhookURL) => {
    let success = false;
    try {
      const getRoomData = await Model.findOne({ roomData: { roomToken } });
      if (!getRoomData) {
        // Room hasnt been created yet
        success = false;
      }
      getRoomData.roomData.roomMembers.push(otherGuildId);
      getRoomData.roomData.roomWebhooks.push(otherGuildWebhookURL);
      getRoomData.save();
      success = true;
    } catch (error) {
      success = false;
      console.error(`Error on addGuildToRoom: ${error}`);
    }
    return success;
  },
};
