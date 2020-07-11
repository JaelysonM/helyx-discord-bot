const fs = require('fs')

class RoleController {
  addRole(name) {
    var roles = require('../cargos.json')

    if (roles.includes(name)) return false

    roles.push(name)

    fs.writeFileSync('cargos.json', JSON.stringify(roles, null, '\t'), 'utf8')
    return true
  }

  removeRole(name) {
    var roles = require('../cargos.json')

    var idx = roles.indexOf(name)

    if (idx === -1) return false

    roles.splice(idx, 1)

    fs.writeFileSync('cargos.json', JSON.stringify(roles, null, '\t'), 'utf8')
    return true
  }

  setMessage(id, channel) {
    let emojis = require('../emojiRole.json')

    emojis.id = id
    emojis.channel = channel

    fs.writeFileSync('emojiRole.json', JSON.stringify(emojis, null, '\t'), 'utf8')
  }

  addEmoji(emoji, role) {
    let emojis = require('../emojiRole.json')

    emojis.emojis[emoji] = role

    fs.writeFileSync('emojiRole.json', JSON.stringify(emojis, null, '\t'), 'utf8')
  }

  removeEmoji(emoji) {
    let emojis = require('../emojiRole.json')

    if (!emojis.emojis[emoji]) return

    delete emojis.emojis[emoji]

    fs.writeFileSync('emojiRole.json', JSON.stringify(emojis, null, '\t'), 'utf8')
  }

  async updateMsg(client) {
    let emojis = require('../emojiRole.json')

    const channel = client.channels.cache.get(emojis.channel)
    const message = await channel.message.fetch(emojis.id)

    const content = Object.keys(emojis.emojis).map(emoji => {
      const role = message.guild.roles.cache.get(emojis.emojis[emoji])

      const actualEmoji = client.emojis.get(emoji)

      if (!role || !emoji) return this.removeEmoji(emoji)

      const rolename = role.name

      return `Reaja com ${actualEmoji} para obter o cargo **${rolename}**`
    })

    message.edit(content.join('\n'))

    Object.keys(emojis.emojis).forEach(emoji => message.react(client.emojis.get(emoji)))
  }
}

module.exports = RoleController