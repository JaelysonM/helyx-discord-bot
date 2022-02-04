const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, command) => {
  if (!client.hasPermission(command, message.member))
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
  if (!client.avaliableUsage(message.guild))
    return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

  const config = client.configCache.get(message.guild.id);

  if (!config.reviewsEnabled) {
    return message.channel.send(`🚫 A criação de revisões foi desabilitada por um superior.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
  }
  message.channel.send(new MessageEmbed()
    .setDescription(config.reviewDescription)
    .setColor(`#36393f`)).then(async message => { try { await message.delete({ timeout: 6000 }) } catch (error) { } })

}

exports.help = {
  name: 'revisao',
  roles: ['MEMBRO'],
  description: 'Recebe o formulário para revisão de punições;'
}