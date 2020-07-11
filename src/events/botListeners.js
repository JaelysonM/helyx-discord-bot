const { ListenerAdapter, ListenerEnums: { READY } } = require('../adapters/ListenerAdapter');

const moment = require('moment');
require("moment-duration-format");

const getRandomRichPresence = (duration, size) => [`📃| Online a ${duration}.`, `🎮| ${size} membros.`][Math.floor(Math.random() * 2)]

module.exports = (client) => class BotListeners extends ListenerAdapter {
  constructor() {
    super(client, [READY]);
  }

  async onBotReady() {
    console.log(`\n\x1b[32m✔\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Bot logged successfuly, with ${client.guilds.cache.size} servers e com ${client.users.cache.size} members.`);

    setInterval(() => {
      let duration = moment.duration(client.uptime).format("H[h], m[m], s[s].");
      let msg = getRandomRichPresence(duration, client.users.cache.size);

      client.user.setPresence({
        game: {
          name: msg,
          type: 1
        }
      });

    }, 1000 * 10);

    client.ticketsGC()
    client.capacityTick();
    client.punishGC();

  }
}