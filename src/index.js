const Discord = require('discord.js');
const config = require('../config.json');

const fs = require("fs");
const client = new Discord.Client();

client.commands = new Discord.Collection();

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load commands.`);
  let arquivojs = files.filter(f => f.split(".").pop() == "js");
  arquivojs.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`\x1b[33m  ⤷\x1b[0m ${f} loaded`)
    client.commands.set(props.help.name, props);
  })
});


client.login(config.token);
console.log(`\n\x1b[32m✔\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Bot logged successfuly.`);



module.exports = { client }

console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load ticket systems and events.`);


const { onTicketChannelMessageSend, onTicketPrivateMessageSend, onTicketPainelReactionAdd, onTicketSelectorReactionAdd } = require('./events/ticketEvents')
const { onBotReady } = require('./events/clientEvents');
const { onCommandExecute } = require('./events/commandEvents');
const { onGuildPreJoin, onGuildJoin } = require('./events/guildEvents');
const { onSendMessageFiltered } = require('./events/chatEvents');
const { onReactionAddPacket, onPresenceUpdate } = require('./events/restEvents');


client.on('guildMemberAdd', onGuildJoin)
client.on('ready', onBotReady)
client.on('message', onTicketChannelMessageSend);
client.on('message', onTicketPrivateMessageSend);
client.on('message', onCommandExecute);
client.on('message', onSendMessageFiltered);
client.on('messageReactionAdd', onTicketPainelReactionAdd)
client.on('messageReactionAdd', onTicketSelectorReactionAdd);
client.on('messageReactionAdd', onGuildPreJoin);
client.on('raw', onReactionAddPacket);
client.on('raw', onPresenceUpdate);

const { ticketsGC, capacityTick } = require('./controllers/TicketController');

const { punishGC } = require('./controllers/PunishController');

ticketsGC();
punishGC();

capacityTick();

