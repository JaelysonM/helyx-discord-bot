
const Discord = require('discord.js');

const config = require('../../config.json')

const { client } = require('../');
const { tickets, findTicketById, deleteTicket, ticketPresetMessages, getTicketDelay, addTicketDelay } = require('../controllers/TicketController');

const { composeDateBR, minutesToMillis, toMillis, formatCountdown } = require('../utils/dateUtils')

const { isNumber } = require('../utils/miscsUtils');



async function onTicketPrivateMessageSend(message) {
  if (message.guild !== null || message.author.bot) return;

  if (tickets[message.author.id] != null) {

    const ticketGuild = client.guilds.get(config.attendanceServer)
    const ticket = tickets[message.author.id];

    let messageContent = null;

    if (isNumber(message.content) && parseInt(message.content) <= 8 && parseInt(message.content) > 0) {
      messageContent = ticketPresetMessages[parseInt(message.content) - 1];
      ticket.user.send(messageContent);
      return;
    }
    messageContent = message.content;

    if (ticket.channel === null) {
      const ticketChat = await ticketGuild.createChannel(`#${ticket.user.discriminator}`, { type: 'text' });
      if (ticketChat === null) return;
      ticketChat.setParent(config.ticketsCategory);
      ticketChat.setTopic('Canal de ticket!');

      await ticketChat.send(new Discord.RichEmbed()
        .setDescription(
          `Este ticket foi criado pelo membro:\n\`\`${ticket.user.username + '#' + ticket.user.discriminator}\`\`\n\nReaja com ❌ para encerrar o ticket e deletar o canal;\nReaja com ☝ para adquirir esse ticket;\n\nAtendente responsável: \`\`Nínguem\`\`\n\nID de recuperação do ticket:\n\`\`${ticketChat.id}\`\``)
        .setThumbnail(`https://i.imgur.com/33E8tfJ.png`)
        .setColor(`#01C1BE`)).then(async message => {
          ticket.chatPainelMsg = message;
          await message.react('☝');
          await message.react('❌');
        });
      ticket.channel = ticketChat;

      ticket.user.send(new Discord.RichEmbed()
        .setTitle('Este processo pode demorar alguns segundos!')
        .setDescription('Sua mensagem está sendo encaminhada para a central de tickets, quando recebermos a mensagem você será notificado.')
        .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
        .setColor(`#f5d442`))
    }
    ticket.timestamp = Date.now() + minutesToMillis(10);

    if (ticket.channel !== null)
      if (message.attachments.size > 0) {
        await ticket.channel.send(new Discord.RichEmbed()
          .setTitle(`Mensagem de ${ticket.user.username}#${ticket.user.discriminator}:`)
          .setDescription('Enviou uma imagem:').setImage(message.attachments.array()[0].url).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now()));

      } else {
        await ticket.channel.send(new Discord.RichEmbed()
          .setTitle(`Mensagem de ${ticket.user.username}#${ticket.user.discriminator}:`)
          .setDescription(messageContent).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now()));
      }
    await ticket.user.send(new Discord.RichEmbed()
      .setTitle('Recebemos sua mensagem!')
      .setDescription('Sua mensagem chegou em nossa central de tickets, em alguns momentos você receberá uma resposta de nossos atendentes e será notificado novamente;')
      .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png`)
      .setColor(`#42f5cb`)).then(async callback => await callback.delete(5000));


  } else {
    await message.author.send(':x: Você não possui um ticket aberto, logo não computamos esta mensagem!').then(callback => callback.delete(1500))
  }
}

async function onTicketChannelMessageSend(message) {
  if (message.guild === null || message.author.bot) return;
  if (message.channel.topic != 'Canal de ticket!') return;

  const ticket = findTicketById(message.channel.id);

  if (ticket === null) return;

  if (ticket.holder === null) message.delete();

  if (message.author === ticket.holder) {

    ticket.timestamp = Date.now() + minutesToMillis(10);

    if (message.attachments.size > 0) {
      await ticket.user.send(new Discord.RichEmbed()
        .setTitle(`${message.author.username} respondeu:`)
        .setDescription('Enviou uma imagem:').setImage(message.attachments.array()[0].url).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now())
      );
    } else {
      await ticket.user.send(new Discord.RichEmbed()
        .setTitle(`${message.author.username} respondeu:`)
        .setDescription(message.content).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ').setTimestamp(Date.now())
      );
    }
    await ticket.channel.send(new Discord.RichEmbed()
      .setTitle('Sua mensagem foi enviada para ' + ticket.user.username)
      .setDescription('Sua mensagem chegou até o ``usuário``, aguarde a próxima dúvida ou feche o ticket;')
      .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png`)
      .setColor(`#42f5cb`)).then(async msg => await msg.delete(5000));

  } else {
    await message.delete();
    await message.author.send(new Discord.RichEmbed()
      .setTitle('Ticket já arrematado!')
      .setDescription('Este ticket já está em posse do atendente ' + ticket.holder.username + '#' + ticket.holder.discriminator)
      .setThumbnail(ticket.holder.avatarURL)
      .setColor(`#FF0000`)).then(async msg => await msg.delete(toMillis(10)));
  }
}

async function onTicketPainelReactionAdd(reaction, user) {
  if (reaction.message.guild == null || reaction.message.channel == null || user.bot) return;
  if (reaction.message.channel.topic != 'Canal de ticket!') return;

  const ticket = findTicketById(reaction.message.channel.id);

  if (ticket === null) return;

  switch (reaction.emoji.name) {
    case '☝':
      if (ticket.holder == null) {
        ticket.holder = user;

        ticket.chatPainelMsg.edit(new Discord.RichEmbed()
          .setDescription(
            `Este ticket foi criado pelo membro:\n\`\`${ticket.user.username + '#' + ticket.user.discriminator}\`\`\n\nReaja com ❌ para encerrar o ticket e deletar o canal;\nReaja com ☝ para adquirir esse ticket;\n\nAtendente responsável: \`\`${ticket.holder.username + '#' + ticket.holder.discriminator}\`\`\n\nID de recuperação do ticket:\n\`\`${ticket.chatPainelMsg.channel.id}\`\``)
          .setThumbnail(`https://i.imgur.com/33E8tfJ.png`)
          .setColor(`#01C1BE`))

        if (ticket.holderMessage !== null)
          ticket.holderMessage.edit(new Discord.RichEmbed()
            .setTitle('Você será atendido por ' + user.username)
            .setDescription('\nEnvie qualquer dúvida para o atendente que ela será encaminhada\npara nossa central de tickets, local onde ela será respondida por ``' + user.username + '#' + user.discriminator + '``;\n\nTempo máximo de resposta ``1 minuto``')
            .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png`)
            .setColor(`#51FF00`));


      } else {
        await reaction.remove(user.id);
      }
      break;
    case '❌':
      deleteTicket(ticket, new Discord.RichEmbed()
        .setTitle('Você teve seu ticket fechado!')
        .setDescription('Seu ticket foi encerrado em nossa central por: ``' + user.username + '#' + user.discriminator + '``\n\nVocê terá que esperar ``3 horas`` para criar outro ticket para nós;\nIsso ocorre com todos os tickets fechados em nossa central.\n\nFechado em: ``' + composeDateBR(Date.now()) + '``')
        .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
        .setColor(`#f5d442`));
      if (config.ticketDelay) addTicketDelay(ticket.user);
      break;
  }
}

async function onTicketSelectorReactionAdd(reaction, user) {
  if (reaction.message.guild == null) return;
  if (user.bot) return;
  if (!reaction.message.channel.name.includes('atendimento')) return;
  await reaction.remove(user.id);

  if (!config.ticketsEnabled) {
    await reaction.message.channel.send(new Discord.RichEmbed().setTitle(`Tickets desativados`).
      setDescription(`${user} o criação de tickets está  \`\`desativada\`\`, aguarde e tente novamente mais tarde!`).setColor('#36393f').setImage(
        `https://minecraftskinstealer.com/achievement/38/Cria%C3%A7%C3%A3o%20de%20tickets:/Desativada`
      )).then(async msg => await msg.delete(2000));
    return;
  }

  const account = await getTicketDelay(user);

  if (account.ticketTimestamp != 0 && account.ticketTimestamp > Date.now()) {
    user.send(new Discord.RichEmbed().setTitle(`Intervalo para criação de ticket`).
      setDescription(`${user} Você está em um intervalo de criação de tickets!`).setColor('#36393f').setImage(
        `https://minecraftskinstealer.com/achievement/17/Aguarde:/${formatCountdown(account.ticketTimestamp - Date.now())}`
      )).then(async msg => await msg.delete(10000));
    return;
  }

  if (Object.values(tickets).length >= config.ticketsCapacity) return;

  const ticketGuild = client.guilds.get(config.attendanceServer)

  if (tickets[user.id] != null) return;

  switch (reaction.emoji.name) {
    case '❓':
      reaction.message.channel.send(new Discord.RichEmbed().setTitle(`Criando seu ticket`).
        setDescription(`Pedimos que você redirecione-se as suas mensagens privadas onde estaremos enviando informações.`).setColor('#36393f').setImage(
          `https://minecraftskinstealer.com/achievement/10/${user.username}/Confira+seu+privado!`
        )).then(async msg => await msg.delete(2000));

      const mainPainelMessage = await user.send(`${user}`, new Discord.RichEmbed().setTitle(`Converse conosco`).
        setDescription(`Você pode enviar mais informações sobre sua dúvida do ou no servidor aqui mesmo. Lembrando que, o sistema suporta imagens e links enviados.
  
                    **Perguntas frequentementes enviadas!**
                    Caso sua dúvida seja umas das listadas abaixo, basta enviar o ID correspondente a sua dúvida neste canal! Caso contrario, prossiga informando sua dúvida.
                    \`\`\`01 » Formulário de integração a equipe.\n02 » Formulário de revisão de punição.\n03 » Regras do servidor.\n04 » Como vincular sua conta e vantagens.\n05 » Solicitação e requisitos youtuber.\n06 » Pedido de reembolso.\n07 » Como efetuar uma compra no servidor.\n08 » É possível transferir vip de conta?\`\`\`
                    `));
      const holderMessage = await user.send(new Discord.RichEmbed()
        .setTitle('Aguarde algum atendente...')
        .setDescription('Dentro de alguns momentos ele será arrematado e respondido, fique a vontade para falar sua dúvida.\n\nNão se preocupe se você não for atendido ele irá fechar\nautomaticamente, e você poderá abrir um novo posteriormente.')
        .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
        .setColor(`#f5d442`));

      tickets[user.id] = {
        channel: null,
        guild: ticketGuild,
        user,
        chatPainelMsg: null,
        painelMsg: mainPainelMessage,
        timestamp: Date.now() + minutesToMillis(1),
        holderMessage,
        holder: null,
      }
      break;
  }

}



module.exports = { onTicketPrivateMessageSend, onTicketChannelMessageSend, onTicketPainelReactionAdd, onTicketSelectorReactionAdd }