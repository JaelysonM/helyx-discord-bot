const db = require('quick.db');
const { client } = require('../');

const config = require('../../config.json');

async function addMuteDelay(user, time) {
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
}

function punishGC() {
  setInterval(() => {
    client.guilds.get(config.mainServer).roles.get(config.mutedRole).members.map(async member => {
      const mute = await getMuteDelay(member.user);
      if (mute.muteTimestamp != 0 && mute.muteTimestamp < Date.now()) member.removeRole(config.mutedRole);
    })
  }, 1000 * 60 * 5);
}
async function getMuteDelay(user) {
  let data = await db.fetch(`account_${user.id}`);
  return data == null ? data = {
    ticketTimestamp: 0,
    muteTimestamp: 0,
    minecraftAccount: null,
    punishTimes: 0
  } : data;
}

module.exports = { addMuteDelay, getMuteDelay, punishGC }