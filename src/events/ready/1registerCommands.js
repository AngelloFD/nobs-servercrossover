const { TEST_SERVER1_ID } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
   try {
      const localCommands = getLocalCommands();
      const applicationCommands = await getApplicationCommands(
         client,
         TEST_SERVER1_ID
      );

      for (const localCommand of localCommands) {
         const { name, description, options } = localCommand;

         const existingCommand = await applicationCommands.cache.find(
            (cmd) => cmd.name === name
         );

         if (existingCommand) {
            if (localCommand.deleted) {
               await applicationCommands.delete(existingCommand.id);
               console.warn(`🗑 Deleted command "${name}".`);
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
   } catch (error) {
      console.error(`TThere was an error: ${error}`);
   }
};