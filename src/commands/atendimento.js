const Discord = require('discord.js')

exports.run = async (bot, message, args) => {

const embed = new Discord.RichEmbed()


.setTitle(`Rede Shelds`)
.setAuthor(bot.avatarURL)
.setDescription(`Somente membros verificados possuem acesso aos canais do servidor.`)

message.channel.send(embed).then(async msg => {
    await msg.react(`✅`)
    
})
}
exports.help = {
    name: "marcella"
}