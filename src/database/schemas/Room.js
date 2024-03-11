const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
   roomData: {
      roomToken: {
         type: String,
         required: true,
      },
      roomMembers: [{
         type: Schema.Types.ObjectId,
         ref: 'Guild',
      }],
      roomWebhooks: [{
         type: String,
         default: [],
      }],
   },
});

const Model = model('Room', roomSchema);

module.exports = {
   /**
    * @param {string} guildId
    * @description Get the room data from the guildId
    * @returns {Promise<import('mongoose').Document>}
    */
   getRoomData: async (guildId) => {
      try {
         // From the guildId, get the _id of the guild and search for the roomData
         const data = await Model.findOne({
            'roomData.roomMembers': guildId,
         });
         if (!data) {
            return null;
         }
         return data;
      } catch (error) {
         console.error(`Error on getRoomData: ${error}`);
      }
   },
};
