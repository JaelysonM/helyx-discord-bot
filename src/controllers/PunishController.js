module.exports = client => {
  client.punishGC = () => {
    setInterval(async () => {
      client.configCache.map(async (config, key) => {
        if (!config.isMainServer) return
        client.guilds.cache.get(config.mainServer).roles.cache.get(config.mutedRole).members.map(async member => {
          const mute = await client.getAccount(member.user, member.guild);
          if (mute.muteTimestamp != 0 && Date.now() > mute.muteTimestamp) member.roles.remove(config.mutedRole);
        })
      });

    }, 1000 * 60 * 5);
  }
}