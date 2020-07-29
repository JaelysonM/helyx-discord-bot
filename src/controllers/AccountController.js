
module.exports = client => {
  client.defaultBody = {
    ticketTimestamp: 0,
    muteTimestamp: 0,
    minecraftAccount: null,
    punishTimes: 0,
  },

    client.getAccount = async (user, guild) => {
      const data = await client.accountTable.get(user.id + '_' + guild.id);
      return { ...client.defaultBody, ...data }
    },
    client.updateValues = async (user, guild, arrayKeyValue) => {
      const data = await client.getAccount(user, guild);

      new Map(Object.entries(arrayKeyValue)).forEach((value, key) => {
        if (typeof value == 'string') {
          if (value.includes('minus') || value.includes('plus')) {
            if (value.includes('minus')) {
              data[key] -= parseInt(value.split(';')[1])
            } else {
              data[key] += parseInt(value.split(';')[1])
            }
          } else {
            data[key] = value;
          }
        } else {
          data[key] = value;
        }
      })
      client.updateAccount(user, guild, data)
    },
    client.updateAccount = async (user, guild, body) => {
      client.accountTable.set(user.id + '_' + guild.id, body)
    }
}