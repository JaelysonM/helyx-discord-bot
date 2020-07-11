const { Client, Collection } = require('discord.js');
const { addListener } = require('./controllers/ListenerController');

const fs = require("fs");
const client = new Client();

client.commands = new Collection();
client.config = require('../config');


require('./controllers/TicketController')(client);
require('./controllers/PunishController')(client);

fs.readdir('./src/events/', (err, files) => {
  if (err) console.error(err);
  console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load listeners.\n`);
  files.filter(f => f.split('.').pop() == 'js').forEach(file => {
    const Listener = require(`./events/${file}`)(client);
    console.log(`\x1b[33m  ⤷\x1b[0m ${file} loaded`)
    addListener(new Listener());
  })
});

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load commands.\n`);
  files.filter(f => f.split('.').pop() == 'js').forEach(file => {
    let props = require(`./commands/${file}`);
    console.log(`\x1b[33m  ⤷\x1b[0m ${file} loaded`)
    client.commands.set(props.help.name, props);
  });
});


client.login(client.config.token);







