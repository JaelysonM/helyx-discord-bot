const { client } = require('../');

const config = require('../../config.json')


async function onCommandExecute(message) {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  let prefix = config.prefix;
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.splice(1);

  if (!message.content.startsWith(prefix)) return;

  let archiveCommand = client.commands.get(command.slice(prefix.length));
  if (archiveCommand) cmd.run(client, message, args);
}

module.exports = { onCommandExecute }