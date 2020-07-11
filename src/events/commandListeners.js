const { ListenerAdapter, ListenerEnums: { MESSAGE } } = require('../adapters/ListenerAdapter');

module.exports = (client) => class CommandListeners extends ListenerAdapter {
  constructor() {
    super(client, [MESSAGE]);
  }

  async onMessageListener(message) {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = client.config.prefix;
    let messageArray = message.content.split(' ');
    let command = messageArray[0];
    let args = messageArray.splice(1);

    if (!message.content.startsWith(prefix)) return;

    let archiveCommand = client.commands.get(command.slice(prefix.length));
    if (archiveCommand) archiveCommand.run(client, message, args);
  }
}