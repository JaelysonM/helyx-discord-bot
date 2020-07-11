const db = require('quick.db');

module.exports = client => {
  client.addMuteDelay = async (user, time) => {
    let data = await db.fetch(`account_${user.id}`);
    if (data == null) {
      data = {
        ticketTimestamp: 0,
        muteTimestamp: Date.now() + time,
        minecraftAccount: null,
        punishTimes: 0
      }
    } else {
      data.muteTimestamp = Date.now() + time;
      data.punishTimes += 1;
    }
    db.set(`account_${user.id}`, data)
    return data;
  },
    client.setMuteDelay = async (user, time) => {
      let data = await db.fetch(`account_${user.id}`);
      if (data != null) {
        data.muteTimestamp = time;
        db.set(`account_${user.id}`, data)
      }
      return data;
    },
    client.getMuteDelay = async (user) => {
      let data = await db.fetch(`account_${user.id}`);
      return data == null ? data = {
        ticketTimestamp: 0,
        muteTimestamp: 0,
        minecraftAccount: null,
        punishTimes: 0
      } : data;
    }
  client.punishGC = () => {
    setInterval(async () => {
      client.guilds.cache.get(client.config.mainServer).roles.cache.get(client.config.mutedRole).members.map(async member => {
        const mute = await client.getMuteDelay(member.user);
        if (mute.muteTimestamp != 0 && mute.muteTimestamp < Date.now()) member.roles.remove(client.config.mutedRole);
      })
    }, 1000 * 60 * 5);
  }
}