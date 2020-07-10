const { client } = require('../')

const config = require('../../config.json');

async function onPresenceUpdate(data) {
  try {
    const member = client.guilds.get(config.mainServer).members.find(member => member.id === user.id);
    if (data.t == 'PRESENCE_UPDATE' && member != null) {

      if (data.d.game == null) return member.removeRole('722874503973306401')
      if (data.d.game.state == undefined) return member.removeRole('722874503973306401')

      let valor = data.d.game.state.toLowerCase()
      let n = valor.search(/((?:discord\.gg|discordapp\.com|www\.|http|invite))/g)

      if (n >= 0) member.addRole('722874503973306401')
      if (n >= 0) member.removeRole('707405196635930634')
      if (n < 0 && member.roles.has('722874503973306401')) member.removeRole('722874503973306401')

    }
  } catch (err) { }
}

async function onReactionAddPacket(packet) {
  if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;
  const channel = client.channels.get(packet.d.channel_id);
  if (channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    const reaction = message.reactions.get(emoji);
    if (packet.t === 'MESSAGE_REACTION_ADD') {
      client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
    }
  });
}

module.exports = { onReactionAddPacket, onPresenceUpdate }