const { client } = require('../')

const config = require('../../config.json');

async function onPacketPresence(packet) {
  if (!['PRESENCE_UPDATE'].includes(packet.t)) return;
  const user = client.users.get(packet.d.user.id);
  if (packet.d.game && packet.d.game.state && user);
    client.emit('richPresenceUpdate', packet.d.game, user);
}

async function onPacketReaction(packet) {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  const channel = client.channels.get(packet.d.channel_id);
  if (channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    const reaction = message.reactions.get(emoji);
    if (packet.t === 'MESSAGE_REACTION_ADD') {
      client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
    }
    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
    }
  });
}

module.exports = { onPacketReaction, onPacketPresence }