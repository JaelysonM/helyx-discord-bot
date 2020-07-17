const { MessageEmbed } = require('discord.js')
const fs = require('fs')

exports.run = async (client, message, args, command) => {
  const config = client.configCache.get(message.guild.id);
  message.delete();

  if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

  message.channel.send('Ao completar a verificação todos os canais aparecerão e este ficará oculto.')
  const captcha = await message.channel.send(new MessageEmbed()
    .setAuthor(`Rede Helyx`, `https://media.discordapp.net/attachments/730290989771784262/730291287516905522/logo-helyx-50x50.png`)
    .setDescription(`Somente membros verificados possuem acesso aos canais do servidor.\n Complete a verificação clicando no emoji abaixo. `)
    .setColor(`#36393f`)).then(async msg => await msg.react('✅'));

  config.captchaMessage = captcha.id;
  config.captchaChannel = message.channel.id;
  config.mainServer = message.guild.id
  const configuration = await client.updateGuildValues(message.guild, {
    captchaMessage: captcha.id,
    captchaChannel: message.channel.id,
    mainServer: message.guild.id
  });
  client.configCache.set(message.guild.id, configuration);
}
exports.help = {
  name: 'captcha-message',
  roles: ['GERENTE'],
  description: 'Cria a mensagem completa do captcha do servidor;'



}