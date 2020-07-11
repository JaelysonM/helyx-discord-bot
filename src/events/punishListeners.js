const { ListenerAdapter, ListenerEnums: { GUILD_MEMBER_ROLE_REMOVE } } = require('../adapters/ListenerAdapter');


module.exports = (client) => class BotListeners extends ListenerAdapter {
  constructor() {
    super(client, [GUILD_MEMBER_ROLE_REMOVE]);
  }

  async onGuildMemberRoleRemove(member, role) {
    if (role.id == client.config.mutedRole) {
      client.setMuteDelay(member, 0);
    }
  }
}
