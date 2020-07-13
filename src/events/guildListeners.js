const { MessageEmbed } = require('discord.js')

const { ListenerAdapter, ListenerEnums: { RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD, PRESENCE_UPDATE } } = require('../adapters/ListenerAdapter');

const { formatDateBR } = require('../utils/dateUtils');
const presenceQueue = [];

module.exports = (client) => class GuildListeners extends ListenerAdapter {
  constructor() {
    super(client, [RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD, PRESENCE_UPDATE]);
  }

  async onPresenceUpdate(oldPresence, presence) {
    if (presenceQueue[presence.user] != null) return;
    const customStatus = presence.activities.find(act => act.type == 'CUSTOM_STATUS');

    const member = client.guilds.cache.get(client.config.mainServer).members.cache.find(member => member.id === presence.user.id);

    if (customStatus && customStatus.state != null) {
      const urlMatch = customStatus.state.search(/((?:discord\.gg|discordapp\.com|www\.|htStp|invite))/g);
      if (urlMatch >= 0) {
        if (!member.roles.cache.has(client.config.spammerRole)) {
          presenceQueue[presence.user] = {};
          await presence.user.send(new MessageEmbed().setThumbnail(`https://media1.giphy.com/media/BT4ygwV9vgwAU/giphy.gif?cid=ecf05e47e912f692eb945be82987cdfc10414cf3e9709a37&rid=giphy.gif`).setTitle(`Punição! - __Divulgação__`).setColor(`#525252`)
            .setFooter(`A punição foi aplicada ${formatDateBR(Date.now())}`).setDescription(` || ${presence.user} ||

            Em nosso sistema é feito uma averiguação de \`\`anti-divulgação\`\` pelos status, por tanto foi averiguado que você está com uma mensagem proibida em nosso sistema.\n\nPara a punição ser revogada, basta retirar o \`\`status personalisado!\`\``))
          delete presenceQueue[presence.user]
          if (member.roles.cache.some(r => client.config.staffRoles.includes(r.name))) return;
          member.roles.add(client.config.spammerRole);
          member.roles.remove(client.config.afterCaptchaRole);
        }
        return;
      }
    }
    if (presence.status == 'offline') return;
    if (member.roles.cache.has(client.config.spammerRole)) {
      if (member.roles.cache.some(r => client.config.staffRoles.includes(r.name))) {
        member.roles.add(client.config.afterCaptchaRole)
      } else {
        await member.guild.channels.cache.get(client.config.captchaChannel).messages.fetch(client.config.captchaMessage).then(message => message.reactions.cache.get('✅').users.remove(member.user));
      }
      member.roles.remove(client.config.spammerRole)
    }
  }
  async onGuildMemberAdd(member) {
    await member.guild.channels.cache.get(client.config.captchaChannel).messages.fetch(client.config.captchaMessage).then(message => message.reactions.cache.get('✅').users.remove(member.user));
  }
  async onReactionAddListener(reaction, user) {
    if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
    if (reaction.message.channel.id === client.config.captchaChannel) {
      if (reaction.message.id === client.config.captchaMessage) {
        const memberWhoReacted = reaction.message.guild.members.cache.find(member => member.id === user.id);

        switch (reaction.emoji.name) {
          case '✅':
            if (memberWhoReacted.roles.cache.has(client.config.afterCaptchaRole)) {
              return;
            }
            memberWhoReacted.roles.add(client.config.afterCaptchaRole);

            reaction.message.guild.channels.cache.get(client.config.welcomeChannel).send(new MessageEmbed()
              .setTitle(` Boas vindas, ${user.username}`, ``)
              .setDescription(`\u200b Olá. Você acabou de se integrar ao servidor. Aqui você poderá interagir com diversas pessoas!`)
              .addField(`🎮 IP:`, `redeshelds.com`, true)
              .addField(`:loja: Loja:`, `[Clique aqui](https://loja.redeshelds.com)`, true)
              .addField(`:twitter: Twitter:`, `[@ServidorShelds](https://twitter.com/ServidorShelds)`, true)
              .setThumbnail(user.avatarURL))

            await client.getMuteDelay(user).then(info => {
              if (info.muteTimestamp != 0 && info.muteTimestamp > Date.now()) memberWhoReacted.roles.add(client.config.mutedRole);
            });


            user.send(new MessageEmbed().setThumbnail(`https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif`).setTitle(`Verificado!`).setColor(`#00f7ff`).setDescription(`***Você completou a verificação no servidor.***

            A partir deste momento você tem acesso a todos os canais do servidor disponível para membros.
            
            Evite ser punido de nossos servidores, confira os canais de regras.`))
            break;
        }
      } else {
        await reaction.users.remove(user);
      }

    }
  }
}