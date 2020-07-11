const { MessageEmbed } = require('discord.js')

const { formatDateBR } = require('../utils/dateUtils');

const { hoursToMillis, minutesToMillis , daysToMillis } = require('../utils/timeUtils');

const db = require('quick.db');

module.exports = client => {
  client.deleteTicket = async (ticket, embed) => {
    try {
      if (ticket.painelMsg !== null) ticket.painelMsg.delete();
      if (ticket.holderMessage !== null) ticket.holderMessage.delete();
      if (ticket.channel !== null) ticket.channel.delete();
      ticket.user.send(embed)
      delete tickets[ticket.user.id];
    } catch (err) { }
  },
    client.tickets = [],
    client.addTicketDelay = async (user) => {
      let data = await db.fetch(`account_${user.id}`);
      if (data == null) {
        data = {
          ticketTimestamp: Date.now() + hoursToMillis(3),
          muteTimestamp: 0,
          minecraftAccount: null,
          punishTimes: 0
        }
      } else {
        data.ticketTimestamp = Date.now() + hoursToMillis(3);
      }
      db.set(`account_${user.id}`, data)
      return data;
    },
    client.getTicketDelay = async (user) => {
      let data = await db.fetch(`account_${user.id}`);
      return data == null ? data = {
        ticketTimestamp: 0,
        muteTimestamp: 0,
        minecraftAccount: null,
        punishTimes: 0
      } : data;
    },
    client.capacityTick = () => {

      setInterval(async () => {
        await client.guilds.cache.get(client.config.mainServer).channels.cache.get(client.config.attendancePainelChannel).messages.fetch(client.config.attendancePainelMessage).then(message => {
          message.edit(new MessageEmbed()
            .setTitle(`Área de atendimento ao jogador.`)
            .setDescription(`Clique em um emoji abaixo para ser redirecionado a\n criação de seu ticket, o atendimento será realizado por meio de suas mensagens privadas.\n\nAgora estamos com **${parseFloat((Object.values(client.tickets).length / client.config.ticketsCapacity) * 100).toFixed(2)}%** da central em uso.`)
            .setImage('https://minecraftskinstealer.com/achievement/19/Converse+conosco%21/Clique+no+emoji+abaixo.')
            .setColor(`#36393f`))
        });
      }, 1000 * 60)
    },
    client.ticketsGC = () => {

      daysToMillis(1)
      setInterval(async () => {
        Object.values(client.tickets).filter(result => result.timestamp < Date.now()).forEach(result => {
          client.deleteTicket(result, new MessageEmbed()
            .setTitle('Você teve seu ticket fechado automaticamente!')
            .setDescription(`Seu ticket foi encerrado em nossa central por: \`\`ausência\`\`\n\n${result.holder == null ? `Você poderá criar um novo ticket sem nenhum intervalo de tempo, visto que não havia nenhum atendente com seu ticket;` : `Você terá que esperar \`\`3 horas\`\`\ para criar outro ticket para nós`}\nIsso ocorre com todos os tickets fechados em nossa central.\n\nFechado em: \`\`${formatDateBR(Date.now())}\`\``)
            .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
            .setColor(`#f5d442`))

          if (result.holder != null && client.config.ticketDelay) addTicketDelay(result.user)
        })
      }, minutesToMillis(2));
    },
    client.findTicketById = (id) => {
      return Object.values(client.tickets).filter(result => result.channel != null).filter(result => result.channel.id === id)[0];
    }
}