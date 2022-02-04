const { MessageEmbed } = require('discord.js')

const { formatDateBR } = require('../utils/dateUtils');

exports.run = async (client, message, args, command) => {
  if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`É necessário ser admin para utilizar esse comando.`);
  if (!client.avaliableUsage(message.guild))
    return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`)
  const config = client.configCache.get(message.guild.id);
  if (args.length > 1) {
    if (args.filter(m => ['online', 'offline', 'manutenção'].includes(m.toLowerCase())).length >= 1) {
      const type = args.filter(m => ['online', 'offline', 'manutenção'].includes(m.toLowerCase()));
      if (await message.guild.channels.cache.get(config.statusChannel)) {
        await message.guild.channels.cache.get(config.statusChannel).send(new MessageEmbed()
          .setTitle(`${config.serverName} - Status.`).setColor('#00FFFF')
          .setDescription(`O status de um servidor foi alterado, confira a seguir as informações como, qual servidor, qual horário que o status foi enviado e qual o status atual do mesmo;\`\`\`Servidor: ${args.slice(0, args.indexOf(type)).join(' ')}\nStatus: ${type}\nHorário: ${formatDateBR(Date.now())}  \`\`\``))
      }

    } else {
      return message.channel.send(`🚫 Use: ${config.prefix}status <Nome do servidor> <Online|Offline|Manutenção>.`)
    }
  } else {
    return message.channel.send(`🚫 Use: ${config.prefix}status <Nome do servidor> <Status>.`)
  }
}

exports.help = {
  name: 'status',
  roles: ['Gerente'],
  description: 'Envie uma mensagem de status do servidor;'
}