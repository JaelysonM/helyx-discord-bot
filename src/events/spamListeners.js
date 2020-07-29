const { ListenerAdapter, ListenerEnums: { MESSAGE } } = require('../adapters/ListenerAdapter');

const { MessageEmbed } = require('discord.js')

module.exports = (client) => class SpamListeners extends ListenerAdapter {
  constructor() {
    super(client, [MESSAGE]);
  }
  async onMessageListener(message) {
    if (message.author.bot) return;
    if (message.member != null) return;
    const content = message.content;
    const role = message.guild.roles.cache.find(role => role.name === "GERENTE");
    if (role) {
      if (member.roles.highest.rawPosition >= role.rawPosition)
        commands.push(client.commands.get(key))

    }
    if (content.startsWith("discord.gg/") || content.startsWith(".gg") || content.startsWith("https:") || content.startsWith("http:") || content.startsWith(".me") || content.startsWith('prnt.sc/') || content.startsWith("focus") || content.startsWith("vanish") || content.startsWith("community") || content.startsWith("stone") || content.startsWith("redesky") || content.startsWith("landwars") || content.startsWith("caralho") || content.startsWith("puta") || content.startsWith("fdp") || content.startsWith("cu") || content.startsWith("pnc") || content.startsWith("pau") || content.startsWith("lixo") || content.startsWith("seu merda")) {
      if (message.member.roles.highest.rawPosition < role.rawPosition) {
        message.delete()
        let ErroEmbed = new MessageEmbed()
          .setColor(`#36393f`)
          .setTitle(`Palavra banida ou mensagem divulgativa!`)
          .setDescription("\n Sua mensagem foi detectada como uma frase de calão divulgativo ou contém uma \n palavra banida! você pode ser banido pelo sistema de auto-moderação. \n \n Necessário permissão \`ADMINISTRADOR\` para enviar esta mensagem.")
        message.channel.send(ErroEmbed).then(async message => { try { await message.delete({ timeout: 6000 }) } catch (error) { } })
      }
    }
  }
}