


module.exports = (client) => {
  client.getMemberCommands = (member) => {
    const commands = [];
    client.rolesCommand.map((value, key) => {
      const role = member.guild.roles.cache.find(role => role.name === value[0]);
      if (member.roles.highest.rawPosition >= role.rawPosition)
        commands.push(client.commands.get(key))
    })
    return commands;
  }
}