const { MessageEmbed } = require('discord.js');

const {
  ListenerAdapter, ListenerEnums: {
    RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD, PRESENCE_UPDATE,
  },
} = require('../adapters/ListenerAdapter');

const { formatDateBR } = require('../utils/dateUtils');

const presenceQueue = [];

module.exports = (client) => class GuildListeners extends ListenerAdapter {
  constructor() {
    super(client, [RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD, PRESENCE_UPDATE]);
  }

  async onPresenceUpdate(oldPresence, presence) {
    if (presenceQueue[presence.user] != null) return;
    const customStatus = presence.activities.find((act) => act.type == 'CUSTOM_STATUS');
    client.configCache.map(async (config, key) => {
      if (!config.isMainServer) return;
      const member = client.guilds.cache.get(config.mainServer).members.cache.find((member) => member.id === presence.user.id);

      if (customStatus && customStatus.state != null) {
        const urlMatch = customStatus.state.search(/((?:discord\.gg|discordapp\.com|www\.|htStp|invite))/g);
        if (urlMatch >= 0) {
          if (!member.roles.cache.has(config.spammerRole)) {
            presenceQueue[presence.user] = {};
            await presence.user.send(new MessageEmbed().setThumbnail('https://media1.giphy.com/media/BT4ygwV9vgwAU/giphy.gif?cid=ecf05e47e912f692eb945be82987cdfc10414cf3e9709a37&rid=giphy.gif').setTitle('Punição! - __Divulgação__').setColor('#525252')
              .setFooter(`A punição foi aplicada ${formatDateBR(Date.now())}`)
              .setDescription(` || ${presence.user} ||
  
              Em nosso sistema é feito uma averiguação de \`\`anti-divulgação\`\` pelos status, por tanto foi averiguado que você está com uma mensagem proibida em nosso sistema.\n\nPara a punição ser revogada, basta retirar o \`\`status personalisado!\`\``));
            delete presenceQueue[presence.user];
            if (member.roles.cache.some((r) => config.staffRoles.includes(r.name))) return;
            member.roles.add(config.spammerRole);
            member.roles.remove(config.afterCaptchaRole);
          }
          return;
        }
      }
      if (presence.status == 'offline') return;
      if (member.roles.cache.has(config.spammerRole)) {
        if (member.roles.cache.some((r) => config.staffRoles.includes(r.name))) {
          member.roles.add(config.afterCaptchaRole);
        } else {
          await member.guild.channels.cache.get(config.captchaChannel).messages.fetch(config.captchaMessage).then((message) => message.reactions.cache.get('✅').users.remove(member.user));
        }
        member.roles.remove(config.spammerRole);
      }
    });



  }

  async onGuildMemberAdd(member) {
    const config = client.configCache.get(member.guild.id);
    await member.guild.channels.cache.get(config.captchaChannel).messages.fetch(config.captchaMessage).then((message) => message.reactions.cache.get('✅').users.remove(member.user));
  }

  async onReactionAddListener(reaction, user) {
    if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
    const config = client.configCache.get(reaction.message.guild.id);
    if (reaction.message.channel.id === config.captchaChannel) {
      if (reaction.message.id === config.captchaMessage) {
        const memberWhoReacted = reaction.message.guild.members.cache.find((member) => member.id === user.id);

        switch (reaction.emoji.name) {
          case '✅':
            if (memberWhoReacted.roles.cache.has(config.afterCaptchaRole)) {
              return;
            }
            memberWhoReacted.roles.add(config.afterCaptchaRole);

            reaction.message.guild.channels.cache.get(config.welcomeChannel).send(new MessageEmbed()
              .setTitle(` Boas vindas, ${user.username}`, '')
              .setDescription('\u200b Olá. Você acabou de se integrar ao servidor. Aqui você poderá interagir com diversas pessoas!')
              .addField('🎮 IP:', 'redeshelds.com', true)
              .addField(':loja: Loja:', '[Clique aqui](https://loja.redeshelds.com)', true)
              .addField(':twitter: Twitter:', '[@ServidorShelds](https://twitter.com/ServidorShelds)', true)
              .setThumbnail(user.avatarURL));

            await client.getAccount(user, reaction.message.guild).then((info) => {
              if (info.muteTimestamp != 0 && info.muteTimestamp > Date.now()) memberWhoReacted.roles.add(config.mutedRole);
            });

            user.send(new MessageEmbed().setThumbnail('https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif').setTitle('Verificado!').setColor('#00f7ff')
              .setDescription(`***Você completou a verificação no servidor.***

            A partir deste momento você tem acesso a todos os canais do servidor disponível para membros.
            
            Evite ser punido de nossos servidores, confira os canais de regras.`));
            break;
        }
      } else {
        await reaction.users.remove(user);
      }
    }
  }
};
