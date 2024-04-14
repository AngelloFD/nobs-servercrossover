const logger = require('node-color-log');

module.exports = class Utils {
  /**
   * @param {import('discord.js').TextChannel} textChannel
   * @description Fetches the text channel webhook. If it doesn't exist, it creates one.
   * @returns {Promise<import('discord.js').Webhook>}
   */
  static async fetchChannelWebhook(textChannel) {
    var webhook = await textChannel
      .fetchWebhooks()
      .then((webhooks) => {
        return webhooks.first();
      })
      .catch((error) => {
        logger.error(`Error on fetching webhooks: ${error}`);
      });
    if (webhook === undefined) {
      var webhook = await textChannel
        .createWebhook({
          textChannel: textChannel.id,
          name: 'Room Webhook',
          reason: 'Room webhook creation',
        })
        .catch((error) => {
          logger.error(`Error on creating webhook command: ${error}`);
        });
    }
    return webhook;
  }

  /**
   * Checks if a string contains a URL
   * @param {string} text
   */
  static containsLink(text) {
    return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
      text
    );
  }

  /**
   * Returns remaining time in days, hours, minutes and seconds
   * @param {number} timeInSeconds
   */
  static timeformat(timeInSeconds) {
    const days = Math.floor((timeInSeconds % 31536000) / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return (
      (days > 0 ? `${days} days, ` : '') +
      (hours > 0 ? `${hours} hours, ` : '') +
      (minutes > 0 ? `${minutes} minutes, ` : '') +
      (seconds > 0 ? `${seconds} seconds` : '')
    );
  }
};
