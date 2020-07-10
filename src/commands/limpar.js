const Discord = require("discord.js");

exports.run = (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("🚫 Você não tem permissão para executar este comando.")

    if(!args[0])  return message.reply("🚫 Use: /limpar <quantidade>.")

    const embed = new Discord.RichEmbed()
    message.channel.bulkDelete(args[0]).then(() => {

    });
}

exports.help = {
   name: "limpar"
}