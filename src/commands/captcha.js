const { MessageEmbed } = require('discord.js')
const fs = require('fs')

exports.run = async (client, message, args) => {

  message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("🚫 Você não tem permissão para executar este comando.").then(message => message.delete({ timeout: 4000 }))

  message.channel.send('Ao completar a verificação todos os canais aparecerão e este ficará oculto.')
  const captcha = await message.channel.send(new MessageEmbed()
    .setAuthor(`Rede Helyx`, `https://media.discordapp.net/attachments/730290989771784262/730291287516905522/logo-helyx-50x50.png`)
    .setDescription(`Somente membros verificados possuem acesso aos canais do servidor.\n Complete a verificação clicando no emoji abaixo. `)
    .setColor(`#36393f`)).then(async msg => await msg.react('✅'));

  client.config.captchaMessage = captcha.id;
  client.config.captchaChannel = message.channel.id;
  client.config.mainServer = message.guild.id
  fs.writeFileSync('config.json', JSON.stringify(client.config, null, '\t'), 'utf8')

}
exports.help = {
  name: "captcha532"
}