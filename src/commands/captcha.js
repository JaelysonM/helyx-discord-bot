const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, command) => {

  if (!client.hasPermission(command, message.member))
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
  const config = client.configCache.get(message.guild.id);
  message.channel.send('Ao completar a verificação todos os canais aparecerão e este ficará oculto.')
  const captcha = await message.channel.send(new MessageEmbed()
    .setAuthor(config.serverName, `${client.user.avatar != null ? client.user.avatar : "https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif"}`)
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
  roles: ['MASTER'],
  description: 'Cria a mensagem completa do captcha do servidor;'



}