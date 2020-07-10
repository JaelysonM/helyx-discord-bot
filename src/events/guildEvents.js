const config = require('../../config.json');

const Discord = require('discord.js')

const { getMuteDelay } = require('../controllers/PunishController')


async function onGuildJoin(member) {
  member.guild.channels.get(config.captchaChannel).overwritePermissions(member, {
    "VIEW_CHANNEL": true,
    "READ_MESSAGES": true,
    "ADD_REACTIONS": true,
    "SEND_MESSAGES": false

  })
  const message = await member.guild.channels.get(config.captchaChannel).fetchMessage(config.captchaMessage);
  message.reactions.get('✅').remove(member.user.id)
}


async function onGuildPreJoin(reaction, user) {
  if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
  if (reaction.message.channel.id === config.captchaChannel) {
    if (reaction.message.id === config.captchaMessage) {
      const memberWhoReacted = reaction.message.guild.members.find(member => member.id === user.id);
      switch (reaction.emoji.name) {
        case '✅':
          memberWhoReacted.addRole(config.afterCaptchaRole);
          reaction.message.channel.overwritePermissions(user, {
            "VIEW_CHANNEL": false,
            "ADD_REACTIONS": false,
            "REMOVE_REACTIONS": false,
            "SEND_MESSAGES": false,
            "READ_MESSAGES": false,
          })
          reaction.message.guild.channels.get(config.welcomeChannel).send(new Discord.RichEmbed()
            .setTitle(` Boas vindas, ${user.username}`, ``)
            .setDescription(`\u200b Olá. Você acabou de se integrar ao servidor. Aqui você poderá interagir com diversas pessoas!`)
            .addField(`🎮 IP:`, `redeshelds.com`, true)
            .addField(`:loja: Loja:`, `[Clique aqui](https://loja.redeshelds.com)`, true)
            .addField(`:twitter: Twitter:`, `[@ServidorShelds](https://twitter.com/ServidorShelds)`, true)
            .setThumbnail(user.avatarURL))

          const mute = await getMuteDelay(user);
          if (mute.muteTimestamp != 0 && mute.muteTimestamp > Date.now()) memberWhoReacted.addRole(config.mutedRole);
          break;
      }
    } else {
      await reaction.remove(user.id);
    }

  }
}

module.exports = { onGuildPreJoin, onGuildJoin };