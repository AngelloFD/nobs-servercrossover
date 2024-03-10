const mongoose = require('mongoose');
const { MONGO_URI } = require('../../config.json');

mongoose.set('strictQuery', true);

module.exports = {
  async initializeMongoose() {
    console.info('Initializing MongoDB');
    if (!MONGO_URI) return console.warn('No MongoDB URI provided');
    await mongoose
      .connect(MONGO_URI || '')
      .then(() => console.info('Connected to MongoDB'))
      .catch((err) =>
        console.error(`Error connecting to mongodb database: ${err}`)
      );
  },
  schemas: {
    Guild: require('./schemas/Guild.js'),
  },
};
