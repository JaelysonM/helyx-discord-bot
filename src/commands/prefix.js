const { MessageEmbed } = require('discord.js')


exports.run = async (client, message, args) => {

  message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("🚫 Você não tem permissão para executar este comando.").then(message => message.delete({ timeout: 4000 }))
  if (!args[0]) return message.reply(`🚫 Use: ${client.config.prefix}prefix <prefixo>.`).then(message => message.delete({ timeout: 5000}))

  await message.channel.send(new MessageEmbed()
    .setThumbnail('https://i.imgur.com/jF1hPnt.png')
    .setAuthor(`Rede Helyx`, `https://media.discordapp.net/attachments/730290989771784262/730291287516905522/logo-helyx-50x50.png`)
    .setDescription(`O prefixo dos comandos foi alterado de \`\`${client.config.prefix}\`\` para \`\`${args[0]}\`\`;`)
    .setFooter(`Prefixo alterado por ${message.author.username}`, message.author.avatarURL).setTimestamp(Date.now())
    .setColor(`#36393f`));

  client.config.prefix = args[0];
  fs.writeFileSync('config.json', JSON.stringify(config, null, '\t'), 'utf8')

}
exports.help = {
  name: "prefix"
}