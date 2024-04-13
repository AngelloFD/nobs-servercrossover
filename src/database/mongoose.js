const mongoose = require('mongoose');
const { MONGO_URI } = require('../../config.json');
const logger = require('node-color-log');

mongoose.set('strictQuery', true);

module.exports = {
  async initializeMongoose() {
    logger.info('Initializing MongoDB');
    if (!MONGO_URI) return logger.warn('No MongoDB URI provided');
    await mongoose
      .connect(MONGO_URI || '')
      .then(() => logger.info('Connected to MongoDB'))
      .catch((err) =>
        logger.error(`Error connecting to mongodb database: ${err}`)
      );
  },
  schemas: {
    Guild: require('./schemas/Guild.js'),
    Room: require('./schemas/Room.js'),
  },
};
