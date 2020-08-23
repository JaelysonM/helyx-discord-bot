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
      if (!client.avaliableUsage(client.guilds.cache.get(key))) return;
      if (!client.guilds.cache.get(config.mainServer)) return;
      const member = client.guilds.cache.get(config.mainServer).members.cache.find((member) => member.id === presence.user.id);
      if (member == null) return;
      if (customStatus && customStatus.state != null) {
        const urlMatch = customStatus.state.search(/((?:discord\.gg|discordapp\.com|www\.|htStp|invite))/g);
        if (member.roles.cache.some((r) => config.staffRoles.includes(r.name))) return;
        if (urlMatch >= 0) {
          if (!member.roles.cache.has(config.spammerRole)) {
            presenceQueue[presence.user] = {};
            try {
              await presence.user.send(new MessageEmbed().setThumbnail('https://media1.giphy.com/media/BT4ygwV9vgwAU/giphy.gif?cid=ecf05e47e912f692eb945be82987cdfc10414cf3e9709a37&rid=giphy.gif').setTitle('Punição! - __Divulgação__').setColor('#525252')
                .setFooter(`A punição foi aplicada ${formatDateBR(Date.now())}`)
                .setDescription(` || ${presence.user} ||
  
              Em nosso sistema é feito uma averiguação de \`\`anti-divulgação\`\` pelos status, por tanto foi averiguado que você está com uma mensagem proibida em nosso sistema.\n\nPara a punição ser revogada, basta retirar o \`\`status personalizado!\`\``));
            } catch (error) { }
            delete presenceQueue[presence.user];
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
    if (!client.avaliableUsage(member.guild.id)) return;
    if (config.isMainServer)
      await member.guild.channels.cache.get(config.captchaChannel).messages.fetch(config.captchaMessage).then((message) => message.reactions.cache.get('✅').users.remove(member.user));
  }

  async onReactionAddListener(reaction, user) {
    if (!reaction) return;
    if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
    const config = client.configCache.get(reaction.message.guild.id);
    if (!config) return;
    if (!config.isMainServer) return;
    if (reaction.message.channel.id === config.captchaChannel) {
      if (reaction.message.id === config.captchaMessage) {
        const memberWhoReacted = reaction.message.guild.members.cache.find((member) => member.id === user.id);

        switch (reaction.emoji.name) {
          case '✅':
            if (memberWhoReacted.roles.cache.has(config.afterCaptchaRole)) {
              return;
            }
            memberWhoReacted.roles.add(config.afterCaptchaRole);
            if (config.welcomeMessage != null) {
              function replacer(key, value) {
                if (typeof value === 'string') {
                  if (value.includes('${username}')) {
                    return value.replace('${username}', user.username);
                  } else if (value.includes('${discriminator}')) {
                    return value.replace('${discriminator}', user.discriminator);
                  } else if (value.includes('${currentDate}')) {
                    return value.replace('${currentDate}', Date.now());
                  } else if (value.includes('${serverName}')) {
                    return value.replace('${serverName}', reaction.message.guild.name);
                  } else if (value.includes('${serverId}')) {
                    return value.replace('${serverId}', reaction.message.guild.id);
                  } else if (value.includes('${userAvatar}')) {
                    return value.replace('${userAvatar}', user.avatarURL);
                  } else if (value.includes('${serverIcon}')) {
                    return value.replace('${serverIcon}', reaction.message.guild.iconURL);
                  } else if (value.includes('${userId}')) {
                    return value.replace('${userId}', user.id);
                  }
                }
                return value;
              }
              var jsonString = JSON.stringify(config.welcomeMessage, replacer);
              var jsonReplaced = JSON.parse(jsonString);
              reaction.message.guild.channels.cache.get(config.welcomeChannel).send(jsonReplaced.content, { embed: jsonReplaced.embed });
            }

            await client.getAccount(user, reaction.message.guild).then((info) => {
              if (info.muteTimestamp != 0 && info.muteTimestamp > Date.now()) memberWhoReacted.roles.add(config.mutedRole);
            });

            try {
              await user.send(new MessageEmbed().setThumbnail('https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif').setTitle('Verificado!').setColor('#00f7ff')
                .setDescription(`***Você completou a verificação no servidor.***

          A partir deste momento você tem acesso a todos os canais do servidor disponível para membros.
          
          Evite ser punido de nossos servidores, confira os canais de regras.`));
            } catch (error) { }
            break;
        }
      } else {
        await reaction.users.remove(user);
      }
    }
  }
};
