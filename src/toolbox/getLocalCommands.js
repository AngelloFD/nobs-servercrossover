const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, '..', 'commands'),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      // Convert BigInt values in requiredPermissions and botPermissions to strings
      if (commandObject.requiredPermissions) {
        commandObject.requiredPermissions =
          commandObject.requiredPermissions.map((permission) =>
            permission.toString()
          );
      }
      if (commandObject.botPermissions) {
        commandObject.botPermissions = commandObject.botPermissions.map(
          (permission) => permission.toString()
        );
      }

      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
