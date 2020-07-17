const { MessageEmbed } = require('discord.js');
const { ListenerAdapter, ListenerEnums: { MESSAGE, REACTION_ADD } } = require('../adapters/ListenerAdapter');


const { formatTimer } = require('../utils/dateUtils');

const { minutesToMillis } = require('../utils/timeUtils');

const { isNumber } = require('../utils/methods');

module.exports = (client) => class TicketChatListeners extends ListenerAdapter {
  constructor() {
    super(client, [MESSAGE, REACTION_ADD]);
  }

  async onMessageListener(message) {
    if (message.guild !== null || message.author.bot) return;
    if (client.tickets[message.author.id] != null) {
      const ticket = client.tickets[message.author.id];
      const config = client.configCache.get(ticket.guild.id);
      const ticketGuild = client.guilds.cache.get(config.attendanceServer);



      let messageContent = null;

      if (isNumber(message.content) && parseInt(message.content) <= 8 && parseInt(message.content) > 0) {
        messageContent = config.ticketPresetMessages[parseInt(message.content) - 1];
        ticket.user.send(messageContent);
        return;
      }
      messageContent = message.content;

      if (ticket.channel === null) {
        const ticketChat = await ticketGuild.channels.create(`#${ticket.user.discriminator}`, { type: 'text' });
        if (ticketChat === null) return;
        ticketChat.setParent(config.ticketsCategory);
        ticketChat.setTopic('Canal de ticket!');

        await ticketChat.send(new MessageEmbed()
          .setDescription(
            `Este ticket foi criado pelo membro:\n\`\`${`${ticket.user.username}#${ticket.user.discriminator}`}\`\`\n\nReaja com ❌ para encerrar o ticket e deletar o canal;\nReaja com ☝ para adquirir esse ticket;\n\nAtendente responsável: \`\`Nínguem\`\`\n\nID de recuperação do ticket:\n\`\`${ticketChat.id}\`\``,
          )
          .setThumbnail('https://i.imgur.com/33E8tfJ.png')
          .setColor('#01C1BE')).then(async (message) => {
            ticket.chatPainelMsg = message;
            await message.react('☝');
            await message.react('❌');
          });
        ticket.channel = ticketChat;

        ticket.user.send(new MessageEmbed()
          .setTitle('Este processo pode demorar alguns segundos!')
          .setDescription('Sua mensagem está sendo encaminhada para a central de tickets, quando recebermos a mensagem você será notificado.')
          .setThumbnail('https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png')
          .setColor('#f5d442'));
      }
      ticket.timestamp = Date.now() + minutesToMillis(10);

      if (ticket.channel !== null) {
        if (message.attachments.size > 0) {
          if (ticket.channel != null) {
            await ticket.channel.send(new MessageEmbed()
              .setTitle(`Mensagem de ${ticket.user.username}#${ticket.user.discriminator}:`)
              .setDescription('Enviou uma imagem:').setImage(message.attachments.array()[0].url)
              .setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ')
              .setTimestamp(Date.now()));
          }
        } else if (ticket.channel != null) {
          await ticket.channel.send(new MessageEmbed()
            .setTitle(`Mensagem de ${ticket.user.username}#${ticket.user.discriminator}:`)
            .setDescription(messageContent).setFooter('Todas as mensagem enviadas neste canal serão redirecionadas; ')
            .setTimestamp(Date.now()));
        }
      }
      await ticket.user.send(new MessageEmbed()
        .setTitle('Recebemos sua mensagem!')
        .setDescription('Sua mensagem chegou em nossa central de tickets, em alguns momentos você receberá uma resposta de nossos atendentes e será notificado novamente;')
        .setThumbnail('https://media.discordapp.net/attachments/678369832147615775/688730080440352823/RespTicket.png')
        .setColor('#42f5cb')).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
    } else {
      message.author.send(':x: Você não possui um ticket aberto, logo não computamos esta mensagem!').then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } });
    }
  }

  async onReactionAddListener(reaction, user) {
    if (reaction.message.guild == null) return;
    if (user.bot) return;
    if (!reaction.message.channel.name.includes('atendimento')) return;
    reaction.users.remove(user);
    const config = client.configCache.get(reaction.message.guild.id);
    if (!config.ticketsEnabled) {
      try {
        const message = await user.send(new MessageEmbed().setTitle('Tickets desativados!')
          .setDescription(`${user} o criação de tickets está  \`\`desativada\`\`, aguarde e tente novamente mais tarde!`).setColor('#36393f')
          .setImage(
            'https://minecraftskinstealer.com/achievement/38/Cria%C3%A7%C3%A3o%20de%20tickets:/Desativada',
          ))
        try { await message.delete({ timeout: 4000 }) } catch (error) { }
      } catch (error) { }
      return;
    }

    const account = await client.getAccount(user, reaction.message.guild);
    if (config.ticketDelay && account.ticketTimestamp != 0 && account.ticketTimestamp > Date.now()) {
      try {
        const message = await user.send(new MessageEmbed().setTitle('Intervalo para criação de ticket!')
          .setDescription(`${user} Você está em um intervalo de criação de tickets!`).setColor('#36393f')
          .setImage(
            `https://minecraftskinstealer.com/achievement/17/Aguarde:/${formatTimer(account.ticketTimestamp - Date.now())}`,
          ))
        try { await message.delete({ timeout: 10000 }) } catch (error) { }

      } catch (error) { }

      return;
    }

    if (Object.values(client.tickets).length >= config.ticketsCapacity) return;
    const ticketGuild = client.guilds.cache.get(config.attendanceServer);
    if (client.tickets[user.id]) return;



    switch (reaction.emoji.name) {
      case '❓':
        try {
          const message = await reaction.message.channel.send(new MessageEmbed().setTitle('Criando seu ticket')
            .setDescription('Pedimos que você redirecione-se as suas mensagens privadas onde estaremos enviando informações.').setColor('#36393f')
            .setImage(
              `https://minecraftskinstealer.com/achievement/10/${user.username}/Confira+seu+privado`))
          try { await message.delete({ timeout: 2000 }) } catch (error) { }
        } catch (error) {
          const message = await reaction.message.channel.send(new MessageEmbed().setTitle('Não pudemos criar seu ticket!')
            .setDescription('Pedimos que você ative o envio de mensagem privadas para prosseguir com a criação do ticket.').setColor('#36393f')
            .setImage(
              `https://minecraftskinstealer.com/achievement/6/${user.username}/DM fechada`))
          try { await message.delete({ timeout: 2000 }) } catch (error) { }
          return;
        }

        const mainPainelMessage = await user.send(`${user}`, new MessageEmbed().setTitle('Converse conosco')
          .setDescription(`Você pode enviar mais informações sobre sua dúvida do ou no servidor aqui mesmo. Lembrando que, o sistema suporta imagens e links enviados.
  
                    **Perguntas frequentemente enviadas!**
                    Caso sua dúvida seja umas das listadas abaixo, basta enviar o ID correspondente a sua dúvida neste canal! Caso contrario, prossiga informando sua dúvida.
                    \`\`\`01 » Formulário de integração a equipe.\n02 » Formulário de revisão de punição.\n03 » Regras do servidor.\n04 » Como vincular sua conta e vantagens.\n05 » Solicitação e requisitos youtuber.\n06 » Pedido de reembolso.\n07 » Como efetuar uma compra no servidor.\n08 » É possível transferir vip de conta?\`\`\`
                    `));
        const holderMessage = await user.send(new MessageEmbed()
          .setTitle('Aguarde algum atendente...')
          .setDescription('Dentro de alguns momentos ele será arrematado e respondido, fique a vontade para falar sua dúvida.\n\nNão se preocupe se você não for atendido ele irá fechar\nautomaticamente, e você poderá abrir um novo posteriormente.')
          .setThumbnail('https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png')
          .setColor('#f5d442'));

        client.tickets[user.id] = {
          channel: null,
          guild: ticketGuild,
          user,
          chatPainelMsg: null,
          painelMsg: mainPainelMessage,
          timestamp: Date.now() + minutesToMillis(1),
          holderMessage,
          holder: null,
        };
        break;
    }
  }
};
