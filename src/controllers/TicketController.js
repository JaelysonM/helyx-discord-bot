const { MessageEmbed } = require('discord.js')

const { formatDateBR } = require('../utils/dateUtils');

const { hoursToMillis, minutesToMillis, daysToMillis } = require('../utils/timeUtils');

module.exports = client => {
  client.tickets = [],

    client.deleteTicket = async (ticket, embed) => {
      try {
        if (ticket.painelMsg !== null) ticket.painelMsg.delete();
        if (ticket.holderMessage !== null) ticket.holderMessage.delete();
        if (ticket.channel !== null) ticket.channel.delete();
        delete client.tickets[ticket.user.id];
        try {
          await ticket.user.send(embed)
        } catch (error) { }
      } catch (err) { }

    },
    client.capacityTick = () => {

      setInterval(async () => {
        client.configCache.map(async (config, key) => {
          if (!config.isMainServer) return;
          if (!client.avaliableUsage(client.guilds.cache.get(key))) return;
          if (!client.guilds.cache.get(config.mainServer)) return;
          await client.guilds.cache.get(config.mainServer).channels.cache.get(config.attendancePainelChannel).messages.fetch(config.attendancePainelMessage).then(message => {
            message.edit(new MessageEmbed()
              .setTitle(`Área de atendimento ao jogador.`)
              .setDescription(`Clique no emoji abaixo para ser redirecionado a\n criação de seu ticket, o atendimento será realizado por meio de suas mensagens privadas. [Saiba mais!](https://support.discord.com/hc/pt-br/sections/201131318-Mensagem-Privada)\n\nAgora estamos com **${parseFloat((Object.values(client.tickets).length / config.ticketsCapacity) * 100).toFixed(2)}%** da central em uso.`)
              .setImage('https://minecraftskinstealer.com/achievement/19/Converse+conosco%21/Clique+no+emoji+abaixo.')
              .setColor(`#36393f`))
          });
        })


      }, 1000 * 60);
    },
    client.ticketsGC = () => {
      setInterval(async () => {
        Object.values(client.tickets).filter(result => result.timestamp < Date.now()).forEach(result => {
          client.deleteTicket(result, new MessageEmbed()
            .setTitle('Você teve seu ticket fechado automaticamente!')
            .setDescription(`Seu ticket foi encerrado em nossa central por: \`\`ausência\`\`\n\n${result.holder == null ? `Você poderá criar um novo ticket sem nenhum intervalo de tempo, visto que não havia nenhum atendente com seu ticket;` : `Você terá que esperar \`\`3 horas\`\`\ para criar outro ticket para nós`}\nIsso ocorre com todos os tickets fechados em nossa central.\n\nFechado em: \`\`${formatDateBR(Date.now())}\`\``)
            .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
            .setColor(`#f5d442`))
          const config = client.configCache.get(result.mainGuild.id);
          if (result.holder != null && config.ticketDelay)
            client.updateValues(result.user, result.mainGuild, {
              ticketTimestamp: Date.now() + hoursToMillis(3)
            })

        })
      }, minutesToMillis(2));
    },
    client.findTicketById = (id) => {
      return Object.values(client.tickets).filter(result => result.channel != null).filter(result => result.channel.id === id)[0];
    }
}