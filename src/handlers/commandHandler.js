const { Collection } = require('discord.js');
const { DEVS, TEST_SERVER1_ID, BOT_PREFIX } = require('../../config.json');
const getLocalCommands = require('../toolbox/getLocalCommands');
const { guildIsActive } = require('../database/schemas/Guild');
const logger = require('node-color-log');

const localCommandsCollection = new Collection();
const localCommands = getLocalCommands();
localCommands.forEach((cmd) => localCommandsCollection.set(cmd.name, cmd));

module.exports = {
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   */
  handleSlashCommand: async function (client, interaction) {
    if (!interaction.guild)
      return interaction.reply('This command cannot be ran in DMs.', {
        ephemeral: true,
      });
    if (!interaction.isCommand()) return;
    if (!guildIsActive(interaction.guild.id)) return;
    if (!localCommandsCollection.has(interaction.commandName)) return;

    try {
      const commandObject = localCommandsCollection.get(
        interaction.commandName
      );
      if (!commandObject) return;

      if (commandObject.deleted) {
        interaction.reply({
          content: 'This command is not available.',
          ephemeral: true,
        });
        return;
      }

      if (commandObject.devOnly) {
        if (!DEVS.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Only developers are allowed to run this command.',
            ephemeral: true,
          });
          return;
        }
      }

      if (commandObject.testOnly) {
        if (!(interaction.guild.id === TEST_SERVER1_ID)) {
          interaction.reply({
            content: 'This command cannot be ran here.',
            ephemeral: true,
          });
          return;
        }
      }

      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: 'Not enough permissions.',
              ephemeral: true,
            });
            return;
          }
        }
      }

      if (commandObject.botPermissions?.length) {
        for (const permission of commandObject.botPermissions) {
          const bot = interaction.guild.members.me;

          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: "I don't have enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }

      await commandObject.callback(client, interaction);
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
    }
  },
};

// TODO: Implement cooldowns
// const { timeformat, parsePermissions } = require("../toolbox/utils");
// const cooldownCache = new Map();
/**
 * @param {string} memberId
 * @param {object} cmd
 */
// function applyCooldown(memberId, cmd) {
//    const key = cmd.name + "|" + memberId;
//    cooldownCache.set(key, Date.now());
// }

/**
 * @param {string} memberId
 * @param {object} cmd
 */
// function getRemainingCooldown(memberId, cmd) {
//    const key = cmd.name + "|" + memberId;
//    if (cooldownCache.has(key)) {
//       const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
//       if (remaining > cmd.cooldown) {
//          cooldownCache.delete(key);
//          return 0;
//       }
//       return cmd.cooldown - remaining;
//    }
//    return 0;
// }
