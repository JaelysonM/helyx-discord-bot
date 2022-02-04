


module.exports = (client) => {

  client.hasPermission = (command, member) => {
    if (command.help.roles && !client.getMemberCommands(member).find(cmd => cmd.help.name == command.help.name)) {
      return false;
    } else {
      return true;
    }
  },
    client.getMemberCommands = (member) => {

      const config = client.configCache.get(member.guild.id);
      const commands = [];
      client.rolesCommand.map((value, key) => {
        if (config.command_roles[key]) {
          const role = member.guild.roles.cache.find(role => role.name.toLowerCase() === config.command_roles[key][0].toLowerCase());
          if (role) {
            if (member.roles.highest.rawPosition >= role.rawPosition)
              commands.push(client.commands.get(key))

          }
          return;
        }
        if (value == 'allowed') {
          commands.push(client.commands.get(key))
          return;
        }
        const role = member.guild.roles.cache.find(role => role.name.toLowerCase() === value[0].toLowerCase());
        if (role) {
          if (member.roles.highest.rawPosition >= role.rawPosition)
            commands.push(client.commands.get(key))

        }
      })
      return commands;
    }
}