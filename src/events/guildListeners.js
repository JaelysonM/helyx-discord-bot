const { MessageEmbed } = require('discord.js')

const { ListenerAdapter, ListenerEnums: { RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD } } = require('../adapters/ListenerAdapter');

module.exports = (client) => class GuildListeners extends ListenerAdapter {
  constructor() {
    super(client, [RICH_PRESENCE, REACTION_ADD, GUILD_MEMBER_ADD]);
  }

  async onGuildMemberAdd(member) {

    member.guild.channels.cache.get(client.config.captchaChannel).createOverwrite(member, {
      VIEW_CHANNEL: true,
      READ_MESSAGES: true,
      ADD_REACTIONS: true,
      SEND_MESSAGES: false,
      READ_MESSAGE_HISTORY: true

    })
    await member.guild.channels.cache.get(client.config.captchaChannel).messages.fetch(client.config.captchaMessage).then(message => message.reactions.cache.get('✅').users.remove(member.user.id));
  }
  async onReactionAddListener(reaction, user) {
    if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
    if (reaction.message.channel.id === client.config.captchaChannel) {
      if (reaction.message.id === client.config.captchaMessage) {
        const memberWhoReacted = reaction.message.guild.members.cache.find(member => member.id === user.id);
        switch (reaction.emoji.name) {
          case '✅':
            memberWhoReacted.roles.add(client.config.afterCaptchaRole);
            reaction.message.channel.createOverwrite(user, {
              "VIEW_CHANNEL": false,
              "ADD_REACTIONS": false,
              "REMOVE_REACTIONS": false,
              "SEND_MESSAGES": false,
              "READ_MESSAGES": false,
            })

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
            break;
        }
      } else {
        await reaction.users.remove(user);
      }

    }
  }
  async onRichPresenceUpdate(game, user) {
    if (game == null) return;
    if (game.state == undefined) return;
    let urlMatch = game.state.search(/((?:discord\.gg|discordapp\.com|www\.|htStp|invite))/g);
    const member = client.guilds.cache.get(client.config.mainServer).members.cache.find(member => member.id === user.id);
    if (urlMatch >= 0 && !member.roles.cache.has(client.config.spammerRole) && member.roles.cache.has(client.config.afterCaptchaRole)) {

      member.roles.add(client.config.spammerRole);
      member.removeRole(client.config.afterCaptchaRole);
    } else {
      if (member.roles.cache.has(client.config.spammerRole)) member.roles.remove(client.config.spammerRole)
    }
  }
}