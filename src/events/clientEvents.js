const { client } = require('../')




const getRandomRichPresence = (duration, size) => [`📃| Online a ${duration}.`, `🎮| ${size} membros.`][Math.floor(Math.random() * 2)]

async function onBotReady() {
  const moment = require('moment');
  require("moment-duration-format");

  setInterval(() => {
    let duration = moment.duration(client.uptime).format("H[h], m[m], s[s].");
    let msg = getRandomRichPresence(duration, client.users.size);

    client.user.setPresence({
      game: {
        name: msg,
        type: 1
      }
    });

  }, 1000*10);
}


module.exports = { onBotReady }