const { ListenerAdapter, ListenerEnums: { GUILD_MEMBER_ROLE_REMOVE, REACTION_ADD } } = require('../adapters/ListenerAdapter');
const { MessageEmbed } = require('discord.js');
const { formatDateBR } = require('../utils/dateUtils')
module.exports = (client) => class BotListeners extends ListenerAdapter {
  constructor() {
    super(client, [GUILD_MEMBER_ROLE_REMOVE, REACTION_ADD]);
  }

  async onGuildMemberRoleRemove(member, role) {
    const config = client.configCache.get(member.guild.id);
    if (role.id == config.mutedRole) {
      client.updateValues(member.user, member.guild, {
        muteTimestamp: 0
      })
    }
  }
  async onReactionAddListener(reaction, user) {
    if (user.bot) return;
    if (reaction.message.guild == null) return;
    const config = client.configCache.get(reaction.message.guild.id);
    if (reaction.message.channel.id != config.reportChannel) return;

    const embed = reaction.message.embeds[0];
    if (!embed) {
      reaction.users.remove(user)
      return;
    }
    if (reaction.emoji.name == '✅') {
      if (embed.description.includes('Punição aplicada em:') || embed.description.includes('Punição recusada em')) {
        reaction.users.remove(user)
        return;
      }
      const { username, discriminator } = {
        username: embed.author.name.split(' - ')[0].split('#')[0],
        discriminator: embed.author.name.split(' - ')[0].split('#')[1]
      }
      reaction.message.edit(new MessageEmbed().setColor(embed.color).setThumbnail(embed.thumbnail.url).setFooter(embed.footer.text).setDescription(`${embed.description}\n\nPunição aplicada em: **${formatDateBR(Date.now())}**\npor ***${user.username}***.`).setAuthor(embed.author.name, embed.author.proxyIconURL));
      const newUser = client.users.cache.find(user => user.username === username && user.discriminator == discriminator);
      const reportedName = embed.thumbnail.url.split('https://minotar.net/avatar/')[1];
      if (newUser) {
        try {
          newUser.send(new MessageEmbed().setTitle(`Denúncia aceita e acusado punido - ${reportedName}!`).setDescription(`Sua denúncia foi **aceita**, foi averiguado as provas e o motivo inserido e foi possível aplicar a punição sobre. Caso você possua novas denúncias poderá criar novas denúncias e acabar ajudando a rede cada vez mais.

        Pedimos que não faça flood de denúncias, pois poderá ficar sujeito a ser punido pelo tal motivo.`))

        } catch (error) { }
      }
      const acceptChannel = await client.guilds.cache.get(config.attendanceServer).channels.cache.get(config.reportAcceptChannel);

      acceptChannel.send(new MessageEmbed()
        .setAuthor(`Resultado da denúncia de ${username}`, `https://media0.giphy.com/media/geKGJ302nQe60eJnR9/giphy.gif`).setThumbnail(embed.thumbnail.url)
        .setDescription(`A denúncia do ${reportedName}, foi aceita as provas foram averiguadas e aprovadas sobre condições de punição. A punição já foi aplicada dentro do servidor!
        
        Aceita por **${user.username}**.`).setFooter('Denúncia respondida em ' + formatDateBR(Date.now())))
      reaction.message.delete();
    }
    else if (reaction.emoji.name == '❌') {
      if (embed.description.includes('Punição aplicada em:') || embed.description.includes('Punição recusada em')) {
        reaction.users.remove(user)
        return;
      }

      const { username, discriminator } = {
        username: embed.author.name.split(' - ')[0].split('#')[0],
        discriminator: embed.author.name.split(' - ')[0].split('#')[1]
      }
      const reportedName = embed.thumbnail.url.split('https://minotar.net/avatar/')[1];
      reaction.message.edit(new MessageEmbed().setColor(embed.color).setThumbnail(embed.thumbnail.url).setFooter(embed.footer.text).setDescription(`${embed.description}\n\nPunição recusada em: **${formatDateBR(Date.now())}**\npor ***${user.username}***.`).setAuthor(embed.author.name, embed.author.proxyIconURL));
      const newUser = client.users.cache.find(user => user.username === username && user.discriminator == discriminator);
      if (newUser) {
        try {
          newUser.send(new MessageEmbed().setTitle(`Denúncia negada - ${reportedName}!`).setDescription(`
          Sua denúncia foi **negada** por falta de provas ou provas que são insuficientes para aplicar a punição ao jogador. Caso você possua mais provas para comprovar a suposta infração cometida pelo jogador, por favor, crie outra denúncia.
          
          Pedimos encarecidamente que não criem outra denúncia utilizando as mesmas provas que foram utilizadas nesta. Caso isso seja feito, você poderá ser punido pelo mesmo.`))
        } catch (err) { }

      }
      const denyChannel = await client.guilds.cache.get(config.attendanceServer).channels.cache.get(config.reportRejectedChannel);
      denyChannel.send(new MessageEmbed()
        .setAuthor(`Resultado da denúncia de ${username}`, `https://media0.giphy.com/media/geKGJ302nQe60eJnR9/giphy.gif`).setThumbnail(embed.thumbnail.url)
        .setDescription(`A denúncia sobre o ${reportedName}, foi negada sendo assim não contendo provas concretas ou suficientes.
        
        Negada por **${user.username}**.`).setFooter('Denúncia respondida em ' + formatDateBR(Date.now())))
      reaction.message.delete();
    }
  }
}
