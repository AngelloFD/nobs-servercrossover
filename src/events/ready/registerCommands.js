const { REST, Routes } = require('discord.js');
const {
  TEST_SERVER_ID,
  DEV_MODE,
  BOT_TOKEN,
  BOT_ID,
} = require('../../../config.json');
const areCommandsDifferent = require('../../toolbox/areCommandsDifferent');
const getApplicationCommands = require('../../toolbox/getApplicationCommands');
const getLocalCommands = require('../../toolbox/getLocalCommands');

module.exports = async (client) => {
  if (!DEV_MODE) {
    const localCommands = getLocalCommands();
    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

    try {
      console.info(`Started refreshing ${localCommands.length} (/) commands.`);
      await rest.put(Routes.applicationCommands(BOT_ID), {
        body: localCommands,
      });
      console.info(
        '✅ Successfully reloaded application (/) commands. IMPORTANT: This is a global command, it may take up to 1 hour to update in all servers.'
      );
    } catch (error) {
      console.error(`Error on refreshing application (/) commands: ${error}`);
    }
  } else {
    try {
      const localCommands = getLocalCommands();
      const applicationCommands = await getApplicationCommands(
        client,
        TEST_SERVER_ID
      );

      // Step 1: Delete commands that are not in localCommands
      const localCommandNames = new Set(localCommands.map((cmd) => cmd.name));
      for (const applicationCommand of applicationCommands.cache.values()) {
        if (!localCommandNames.has(applicationCommand.name)) {
          await applicationCommands.delete(applicationCommand.id);
          console.warn(`⚠️ Deleted command "${applicationCommand.name}".`);
        }
      }

      // Step 2: Register or update commands based on localCommands
      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;

        const existingCommand = applicationCommands.cache.find(
          (cmd) => cmd.name === name
        );

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.warn(`⚠️ Deleted command "${name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
            });

            console.info(`🔁 Edited command "${name}".`);
          }
        } else {
          if (localCommand.deleted) {
            console.warn(
              `⏩ Skipping registering command "${name}" as it's set to delete.`
            );
            continue;
          }

          await applicationCommands.create({
            name,
            description,
            options,
          });

          console.info(`👍 Registered command "${name}."`);
        }
      }
      console.info('✅ Registered all commands for dev guild.');
    } catch (error) {
      console.error(`Error on registering commands: ${error}`);
    }
  }
};
