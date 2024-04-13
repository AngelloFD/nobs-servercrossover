const { initializeMongoose } = require('../../database/mongoose.js');
const logger = require('node-color-log');
module.exports = async (client) => {
  await initializeMongoose();
  client.user.setActivity('Chat with strangers! Wait-');
  console.log(`Logged in as ${client.user.tag}`);
};
