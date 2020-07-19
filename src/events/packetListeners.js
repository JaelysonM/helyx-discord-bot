
const { ListenerAdapter, ListenerEnums: { PACKET, GUILD_MEMBER_UPDATE, GUILD_MEMBER_ROLE_ADD, GUILD_MEMBER_ROLE_REMOVE, USER_UPDATE_USERNAME, GUILD_MEMBER_UPDATE_NICKNAME, USER_UPDATE_AVATAR } } = require('../adapters/ListenerAdapter');

module.exports =
  (client) => class PacketListeners extends ListenerAdapter {
    constructor() {
      super(client, [PACKET, GUILD_MEMBER_UPDATE]);
    }

    async onGuildMemberUpdate(oldMember, newMember) {

      oldMember.roles.cache.map(value => {
        if (newMember.roles.cache.find(r => r.id == value.id) == null) {
          client.emit(GUILD_MEMBER_ROLE_REMOVE, newMember, value)
          return;
        }
      })
      newMember.roles.cache.map(value => {
        if (oldMember.roles.cache.find(r => r.id == value.id) == null) {
          client.emit(GUILD_MEMBER_ROLE_ADD, newMember, value)
          return;
        }
      });
      if (newMember.user.username != oldMember.user.username) {
        client.emit(USER_UPDATE_USERNAME, newMember.user, newMember.user.username, oldMember.user.username)
        return;
      }
      if (newMember.nickname != oldMember.nickname) {
        client.emit(GUILD_MEMBER_UPDATE_NICKNAME, newMember, newMember.nickname, oldMember.nickname)
        return;
      }
      if (newMember.user.avatarURL != oldMember.user.avatarURL) {
        client.emit(USER_UPDATE_AVATAR, newMember, newMember.user.avatarURL, oldMember.user.avatarURL)
        return;
      }

    }
    async onPacketListener(packet) {
      if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
        const channel = await client.channels.cache.get(packet.d.channel_id);
        if (channel == null) return;

        if (channel.messages.cache.has(packet.d.message_id)) return;
        channel.messages.fetch(packet.d.message_id).then(message => {
          const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
          const reaction = message.reactions.cache.get(emoji);
          if (!reaction) return;
          if (packet.t === 'MESSAGE_REACTION_ADD') {

            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
          }
          else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
          }
        });
      }

    }
  }
