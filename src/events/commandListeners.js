const { ListenerAdapter, ListenerEnums: { MESSAGE } } = require('../adapters/ListenerAdapter');

module.exports = (client) => class CommandListeners extends ListenerAdapter {
  constructor() {
    super(client, [MESSAGE]);
  }

  async onMessageListener(message) {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    if (!client.configCache.has(message.guild.id)) return;

    const { prefix } = client.configCache.get(message.guild.id);
    const messageArray = message.content.split(' ');
    const command = messageArray[0];
    const args = messageArray.splice(1);


    if (!message.content.startsWith(prefix)) return;
    let archiveCommand;
    if (client.commands.has(command.slice(prefix.length))) {
      archiveCommand = client.commands.get(command.slice(prefix.length));
    } else if (client.aliases.has(command.slice(prefix.length))) {
      archiveCommand = client.commands.get(client.aliases.get(command.slice(prefix.length)));
    }
    if (archiveCommand)
      archiveCommand.run(client, message, args, archiveCommand);


  }
}
