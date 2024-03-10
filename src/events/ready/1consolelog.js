const { initializeMongoose } = require('../../database/mongoose.js');
module.exports = async (client) => {
  await initializeMongoose();
  client.user.setActivity('Chat with strangers! Wait-');
  console.log(`Logged in as ${client.user.tag}`);
};
