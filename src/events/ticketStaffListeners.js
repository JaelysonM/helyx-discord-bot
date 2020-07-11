const { ListenerAdapter, ListenerEnums: { MESSAGE, REACTION_ADD } } = require('../adapters/ListenerAdapter');

const { MessageEmbed } = require('discord.js');

const { formatDateBR } = require('../utils/dateUtils')

const { minutesToMillis, toMillis } = require('../utils/timeUtils');


module.exports = (client) => class TicketStaffChatListeners extends ListenerAdapter {
  constructor() {
    super(client, [MESSAGE, REACTION_ADD]);
  }

  async onMessageListener(message) {

    if (message.guild === null || message.author.bot) return;
    if (message.channel.topic != 'Canal de ticket!') return;

    const ticket = client.findTicketById(message.channel.id);

    if (ticket === null) return;

    if (ticket.holder === null) message.delete();

    if (message.author === ticket.holder) {

      ticket.timestamp = Date.now() + minutesToMillis(10);

      if (message.attachments.size > 0) {
        await ticket.user.send(new MessageEmbed()
          .setTitle(`${message.author.username} respondeu:`)
          .setDescription('Enviou uma imagem:').setImage(message.attachments.array()[0].url).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now())
        );
      } else {
        await ticket.user.send(new MessageEmbed()
          .setTitle(`${message.author.username} respondeu:`)
          .setDescription(message.content).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now())
        );
      }
      if (ticket.channel !=null)
      await ticket.channel.send(new MessageEmbed()
        .setTitle('Sua mensagem foi enviada para ' + ticket.user.username)
        .setDescription('Sua mensagem chegou até o ``usuário``, aguarde a próxima dúvida ou feche o ticket;')
        .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png`)
        .setColor(`#42f5cb`)).then(async msg => await msg.delete({ timeout: 5000 }));

    } else {
      await message.delete();
      await message.author.send(new MessageEmbed()
        .setTitle('Ticket já arrematado!')
        .setDescription('Este ticket já está em posse do atendente ' + ticket.holder.username + '#' + ticket.holder.discriminator)
        .setThumbnail(ticket.holder.avatarURL)
        .setColor(`#FF0000`)).then(async msg => await msg.delete({ timeout: toMillis(10) }));
    }
  }

  async onReactionAddListener(reaction, user) {

    if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
    if (reaction.message.channel.topic != 'Canal de ticket!') return;

    const ticket = client.findTicketById(reaction.message.channel.id);

    if (ticket === null) return;

    switch (reaction.emoji.name) {
      case '☝':
        if (ticket.holder == null) {
          ticket.holder = user;

          ticket.chatPainelMsg.edit(new MessageEmbed()
            .setDescription(
              `Este ticket foi criado pelo membro:\n\`\`${ticket.user.username + '#' + ticket.user.discriminator}\`\`\n\nReaja com ❌ para encerrar o ticket e deletar o canal;\nReaja com ☝ para adquirir esse ticket;\n\nAtendente responsável: \`\`${ticket.holder.username + '#' + ticket.holder.discriminator}\`\`\n\nID de recuperação do ticket:\n\`\`${ticket.chatPainelMsg.channel.id}\`\``)
            .setThumbnail(`https://i.imgur.com/33E8tfJ.png`)
            .setColor(`#01C1BE`))

          if (ticket.holderMessage !== null)
            ticket.holderMessage.edit(new MessageEmbed()
              .setTitle('Você será atendido por ' + user.username)
              .setDescription('\nEnvie qualquer dúvida para o atendente que ela será encaminhada\npara nossa central de tickets, local onde ela será respondida por ``' + user.username + '#' + user.discriminator + '``;\n\nTempo máximo de resposta ``1 minuto``')
              .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png`)
              .setColor(`#51FF00`));


        } else {
          await reaction.users.remove(user);
        }
        break;
      case '❌':
        client.deleteTicket(ticket, new MessageEmbed()
          .setTitle('Você teve seu ticket fechado!')
          .setDescription('Seu ticket foi encerrado em nossa central por: ``' + user.username + '#' + user.discriminator + '``\n\nVocê terá que esperar ``3 horas`` para criar outro ticket para nós;\nIsso ocorre com todos os tickets fechados em nossa central.\n\nFechado em: ``' + formatDateBR(Date.now()) + '``')
          .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
          .setColor(`#f5d442`));
        if (client.config.ticketDelay) client.addTicketDelay(ticket.user);
        break;
    }
  }

}