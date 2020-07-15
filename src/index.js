'use-strict'
const { Client, Collection } = require('discord.js');

const fs = require('fs');
const db = require('quick.db');
const client = new Client({ disableEveryone: true });
client.config = require('../config');
client.commands = new Collection();
client.aliases = new Collection();
client.configCache = new Collection();


client.accountTable = new db.table('accounts');
client.configTable = new db.table('configs');

require('./controllers/TicketController')(client);
require('./controllers/PunishController')(client);
require('./controllers/AccountController')(client);
require('./controllers/ConfigurationController')(client);

fs.readdir('./src/events/', (err, files) => {
  if (err) console.error(err);
  console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load listeners.\n`);
  files.filter((f) => f.split('.').pop() == 'js').forEach((file) => {
    const Listener = require(`./events/${file}`)(client);
    console.log(`\x1b[33m  ⤷\x1b[0m ${file} loaded`);
    const lis = new Listener();
    lis.registerListeners();
  });
});

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`\n\x1b[34m⟳\x1b[0m  \x1b[46m\x1b[30m discord.js \x1b[0m Trying to load commands.\n`);
  files.filter((f) => f.split('.').pop() == 'js').forEach((file) => {
    const props = require(`./commands/${file}`);
    console.log(`\x1b[33m  ⤷\x1b[0m ${file} loaded`);
    client.commands.set(props.help.name, props);
    if (props.help.aliases) {
      props.help.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    }
  });
});


client.login(client.config.token);


