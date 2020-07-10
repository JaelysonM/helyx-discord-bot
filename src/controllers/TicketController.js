

const { client } = require('../');

const Discord = require('discord.js')

const config = require('../../config.json');

const { composeDateBR, hoursToMillis } = require('../utils/dateUtils')

const db = require('quick.db');


const tickets = [];


const ticketPresetMessages = [`O link do formulário para ajudante da network são:

> Factions e RankUP: ${config.formSurvival}
> Minigames: ${config.formMinigames}

Resultado o divulgado até 14 dias e o resultado sai na \`\`#formulários\`\` do discord do servidor.
Por fim, os aprovados serão chamados através das mensagens privadas do discord.`

  , `O tempo para resposta é de até 72h e o resultado sai na sala #revisões do discord do servidor.
Link para o formulário: ${config.formRevisao}`

  , `Aqui temos um formulário contendo todas as regras atualizadas do servidor: ${config.formRegras}`

  , `Para vincular sua conta do servidor com o seu discord, basta logar nela, digitar a sua senha, após isso, digite o comando
\`\`/discord vincular\`\` dentro do servidor. Feito isso, você irá receber um código, então pegue esse código e vá na sala 
#comandos do discord do servidor e digite  \`\`.vincular NICK CÓDIGO \`\` e então pronto, sua conta está vinculada. A vantagem é
seguinte, caso você esqueã a sua senha ou a sua conta for hackeada, você pode entrar com ela no servidor e antes de digitar
a sua senha, digite  \`\`/recuperar\`\` e será enviado um código de recuperação a você, então basta ir novamente na sala
#comandos do discord e digitar  \`\`.recuperar PIN \`\`. Por fim, caso queria desvincular a sua conta contate um gerente no privado.`,



  `Para solicitar basta chamar o gerente Tugofo no privado (Tugofo#6867) e para mais informações.
 Temos 3 opções:
 
 1- Opção 1:
     • Mais de 700 assinantes;
     • Mínimo de 10 vídeos no canal;
     • O canal deve ser ativo (mínimo 1 vídeos por semana);
     • 10% de visualização nos vídeo em relação a quantia de assinantes ou 1000 visualizações mensais.
 
 2- Opção 2:
     • Mais de 500 assinantes;
     • Participar de no mínimo 1 vídeo por semana deste parceiro;
     • Participar ativamente de um canal parceiro do servidor, o mesmo deve possuir no mínimo 1.000 assinantes;
     OBS: Caso o mesmo perca a tag, você automaticamente perde também.
 
 3- Requisitos para VIP
     • 400 Assinantes
     •  No mínimo 15 vídeos no canal;
     • 10% de visualização nos vídeos em relação a quantia de assinantes;
     •  Canal deve ser ativo com ao menos 1 vídeo no servidor por semana.`
  , `\`\`MERCADO PAGO\`\`: Acesse: https://www.mercadopago.com.br/ajuda/respostas-solucoes-pagamentos-online_189 e clique em \`\`Tenho um problema com o pagamento.\`\`
 PAYPAL: Você pode conferir como pedir reembolso por PayPal acessando: https://bit.ly/3ecd54P.
 
 Lembrando: Independente de você vencer ou perder a disputa, tem a chance de não receber o dinheiro e ainda será aplicada a punição permanente por Estorno de pagamento em sua conta!`
  , 'Message in Working...'
  , `Não, por questões de segurança optamos por não fazer transferências em nenhum ocasião, a não ser que tenha ocorrido um problema com a compra do produto e seja realmente necessário a transferência.`];



async function deleteTicket(ticket, embed) {
  try {
    if (ticket.painelMsg !== null) ticket.painelMsg.delete();
    if (ticket.holderMessage !== null) ticket.holderMessage.delete();
    if (ticket.channel !== null) ticket.channel.delete();
    ticket.user.send(embed)
    delete tickets[ticket.user.id];
  } catch (err) { }
}


async function addTicketDelay(user) {
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
}
async function getTicketDelay(user) {
  let data = await db.fetch(`account_${user.id}`);
  return data == null ? data = {
    ticketTimestamp: 0,
    muteTimestamp: 0,
    minecraftAccount: null,
    punishTimes: 0
  } : data;
}

function capacityTick() {
  const editSelector = async () => {
    const message = await client.guilds.get(config.mainServer).channels.get(config.attendancePainelChannel).fetchMessage(config.attendancePainelMessage);

    message.edit(new Discord.RichEmbed()
      .setTitle(`Área de atendimento ao jogador.`)
      .setDescription(`Clique em um emoji abaixo para ser redirecionado a\n criação de seu ticket, o atendimento será realizado por meio de suas mensagens privadas.\n\nAgora estamos com **${parseFloat((Object.values(tickets).length / config.ticketsCapacity) * 100).toFixed(2)}%** da central em uso.`)
      .setImage('https://minecraftskinstealer.com/achievement/19/Converse+conosco%21/Clique+no+emoji+abaixo.')
      .setColor(`#36393f`))
  }
  setInterval(editSelector, 1000 * 60)
}

function ticketsGC() {
  setInterval(() => {
    Object.values(tickets).filter(result => result.timestamp < Date.now()).forEach(result => {
      deleteTicket(result, new Discord.RichEmbed()
        .setTitle('Você teve seu ticket fechado automaticamente!')
        .setDescription(`Seu ticket foi encerrado em nossa central por: \`\`ociosidade\`\`\n\n${result.holder == null ? `Você poderá criar um novo ticket sem nenhum intervalo de tempo, visto que não havia nenhum atendente com seu ticket. ` : `Você terá que esperar \`\`3 horas\`\`\ para criar outro ticket para nós`};\nIsso ocorre com todos os tickets fechados em nossa central.\n\nFechado em: \`\`${composeDateBR(Date.now())}\`\``)
        .setThumbnail(`https://media.discordapp.net/attachments/678369832147615775/688730074077331525/AlertTicket.png`)
        .setColor(`#f5d442`))

      if (result.holder != null && config.ticketDelay) addTicketDelay(result.user)
    })
  }, 1000);
}

function findTicketById(id) {
  return Object.values(tickets).filter(result => result.channel != null).filter(result => result.channel.id === id)[0];
}
module.exports = { tickets, ticketsGC, findTicketById, deleteTicket, capacityTick, ticketPresetMessages, addTicketDelay, getTicketDelay };