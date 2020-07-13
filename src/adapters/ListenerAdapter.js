const ListenerEnums = {
  MESSAGE: 'message',
  REACTION_ADD: 'messageReactionAdd',
  REACTION_REMOVE: 'messageReactionRemove',
  READY: 'ready',
  RICH_PRESENCE: 'richPresenceUpdate',
  PACKET: 'raw',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_MEMBER_ROLE_ADD: 'guildMemberRoleAdd',
  GUILD_MEMBER_ROLE_REMOVE: 'guildMemberRoleRemove',

  USER_UPDATE_USERNAME: 'userUsernameUpdate',
  USER_UPDATE_AVATAR: 'userAvatarUpdate',

  GUILD_MEMBER_UPDATE_NICKNAME: 'guildMemberNicknameUpdate',

  PRESENCE_UPDATE: 'presenceUpdate'
}

class ListenerAdapter {

  constructor(client, listeners) {
    this.listeners = listeners;
    this.client = client;
  }
  getListeners() {
    return this.listeners;
  }


  async onUserUpdateUsername(user, oldUsername, newUsername) { }

  async onUserUpdateAvatar(user, oldAvatar, newAvatar) { }

  async onGuildMemberUpdateNickname(member, oldNickname, newNickname) { }

  async onGuildMemberAdd(member) { }

  async onPacketListener(packet) { }

  async onMessageListener(message) { }

  async onReactionAddListener(reaction, user) { }

  async onReactionRemoveListener(reaction, user) { }

  async onBotReady() { }

  async onGuildMemberUpdate(oldMember, newMember) { }

  async onPresenceUpdate(oldMember, newMember) { }

  async onGuildMemberRoleAdd(member, role) { }

  async onGuildMemberRoleRemove(member, role) { }


  async onRichPresenceUpdate(game, user) { }

  registerListeners() {

    if (this.listeners.includes(ListenerEnums.RICH_PRESENCE))
      this.client.on(ListenerEnums.RICH_PRESENCE, this.onRichPresenceUpdate)
    if (this.listeners.includes(ListenerEnums.READY))
      this.client.on(ListenerEnums.READY, this.onBotReady)
    if (this.listeners.includes(ListenerEnums.REACTION_REMOVE))
      this.client.on(ListenerEnums.REACTION_REMOVE, this.onReactionRemoveListener)
    if (this.listeners.includes(ListenerEnums.REACTION_ADD))
      this.client.on(ListenerEnums.REACTION_ADD, this.onReactionAddListener)
    if (this.listeners.includes(ListenerEnums.MESSAGE))
      this.client.on(ListenerEnums.MESSAGE, this.onMessageListener)
    if (this.listeners.includes(ListenerEnums.PACKET))
      this.client.on(ListenerEnums.PACKET, this.onPacketListener)
    if (this.listeners.includes(ListenerEnums.GUILD_MEMBER_ADD))
      this.client.on(ListenerEnums.GUILD_MEMBER_ADD, this.onGuildMemberAdd)
    if (this.listeners.includes(ListenerEnums.GUILD_MEMBER_UPDATE))
      this.client.on(ListenerEnums.GUILD_MEMBER_UPDATE, this.onGuildMemberUpdate)
    if (this.listeners.includes(ListenerEnums.GUILD_MEMBER_ROLE_ADD))
      this.client.on(ListenerEnums.GUILD_MEMBER_ROLE_ADD, this.onGuildMemberRoleAdd)
    if (this.listeners.includes(ListenerEnums.GUILD_MEMBER_ROLE_REMOVE))
      this.client.on(ListenerEnums.GUILD_MEMBER_ROLE_REMOVE, this.onGuildMemberRoleRemove)
    if (this.listeners.includes(ListenerEnums.GUILD_MEMBER_UPDATE_NICKNAME))
      this.client.on(ListenerEnums.GUILD_MEMBER_UPDATE_NICKNAME, this.onGuildMemberUpdateNickname)
    if (this.listeners.includes(ListenerEnums.USER_UPDATE_USERNAME))
      this.client.on(ListenerEnums.USER_UPDATE_USERNAME, this.onUserUpdateUsername)
    if (this.listeners.includes(ListenerEnums.USER_UPDATE_AVATAR))
      this.client.on(ListenerEnums.USER_UPDATE_AVATAR, this.onUserUpdateAvatar)
    if (this.listeners.includes(ListenerEnums.PRESENCE_UPDATE))
      this.client.on(ListenerEnums.PRESENCE_UPDATE, this.onPresenceUpdate)
  }
}
module.exports = {
  ListenerAdapter, ListenerEnums
}