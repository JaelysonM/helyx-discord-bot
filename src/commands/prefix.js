const Discord = require('discord.js')
const fs = require('fs')
var config = require('../../config.json');


exports.run = async (bot, message, args) => {

  message.delete();
 if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("🚫 Você não tem permissão para executar este comando.").then(message => message.delete(4000))
  if(!args[0])  return message.reply(`🚫 Use: ${config.prefix}prefix <prefixo>.`).then(message => message.delete(5000))
  
  await message.channel.send(new Discord.RichEmbed()
  .setThumbnail('https://i.imgur.com/jF1hPnt.png')
    .setAuthor(`Rede Helyx`, `https://media.discordapp.net/attachments/730290989771784262/730291287516905522/logo-helyx-50x50.png`)
    .setDescription(`O prefixo dos comandos foi alterado de \`\`${config.prefix}\`\` para \`\`${args[0]}\`\`;`)
    .setFooter(`Prefixo alterado por ${message.author.username}`, message.author.avatarURL).setTimestamp(Date.now())
    .setColor(`#36393f`));

  config.prefix = args[0];
  fs.writeFileSync('config.json', JSON.stringify(config, null, '\t'), 'utf8')

}
exports.help = {
  name: "prefix"
}