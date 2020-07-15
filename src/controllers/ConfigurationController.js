
module.exports = client => {
  client.defaultConfigBody = {
    isMainServer: true,
    prefix: '&',
    membro: 'membro',
    reportRejectedChannel: null,
    reportAcceptChannel: null,
    captchaChannel: null,
    captchaMessage: null,
    afterCaptchaRole: null,
    attendancePainelChannel: null,
    attendancePainelMessage: null,
    mainServer: null,
    attendanceServer: null,
    ticketsCategory: null,
    welcomeChannel: null,
    spammerRole: null,
    ticketsEnabled: true,
    ticketDelay: true,
    ticketsCapacity: 50,
    staffRoles: [],
    mutedRole: null,
    punishChannel: null,
    appelChannel: null,
    reportChannel: null,
    ticketPresetMessages: [`O link do formulário para ajudante da network são:

      > Factions e RankUP: http://bit.ly/formmini
    > Minigames: http://bit.ly/formsurv
    
    Resultado o divulgado até 14 dias e o resultado sai na \`\`#formulários\`\` do discord do servidor.
    Por fim, os aprovados serão chamados através das mensagens privadas do discord.`, `O tempo para resposta é de até 72h e o resultado sai na sala #revisões do discord do servidor.
    Link para o formulário: http://bit.ly/formrevisao`, `Aqui temos um formulário contendo todas as regras atualizadas do servidor: http://bit.ly/formregras`, `Para vincular sua conta do servidor com o seu discord, basta logar nela, digitar a sua senha, após isso, digite o comando
    \`\`/discord vincular\`\` dentro do servidor. Feito isso, você irá receber um código, então pegue esse código e vá na sala 
    #comandos do discord do servidor e digite  \`\`.vincular NICK CÓDIGO \`\` e então pronto, sua conta está vinculada. A vantagem é
    seguinte, caso você esqueça a sua senha ou a sua conta for hackeada, você pode entrar com ela no servidor e antes de digitar
    a sua senha, digite  \`\`/recuperar\`\` e será enviado um código de recuperação a você, então basta ir novamente na sala
    #comandos do discord e digitar  \`\`.recuperar PIN \`\`. Por fim, caso queria desvincular a sua conta contate um gerente no privado.`, `Para solicitar basta chamar o gerente Tugofo no privado (Tugofo#6867) e para mais informações.
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
        •  Canal deve ser ativo com ao menos 1 vídeo no servidor por semana.`, `\`\`MERCADO PAGO\`\`: Acesse: https://www.mercadopago.com.br/ajuda/respostas-solucoes-pagamentos-online_189 e clique em \`\`Tenho um problema com o pagamento.\`\`
        PAYPAL: Você pode conferir como pedir reembolso por PayPal acessando: https://bit.ly/3ecd54P.
        
        Lembrando: Independente de você vencer ou perder a disputa, tem a chance de não receber o dinheiro e ainda será aplicada a punição permanente por Estorno de pagamento em sua conta`, `Message in Working...`, `Não, por questões de segurança optamos por não fazer transferências em nenhum ocasião, a não ser que tenha ocorrido um problema com a compra do produto e seja realmente necessário a transferência.`]
  },




    client.getGuild = async (guild) => {
      const data = await client.configTable.get(guild.id);
      if (!data) client.configTable.set(guild.id, { ...client.defaultConfigBody, ...data })
      return { ...client.defaultConfigBody, ...data }
    }
  client.updateGuildValues = async (user, arrayKeyValue) => {
    const data = await client.getGuild(user);
    new Map(Object.entries(arrayKeyValue)).forEach((value, key) => {
      if (typeof value == 'string') {
        if (value.includes('minus') || value.includes('plus')) {
          if (value.includes('minus')) {
            data[key] -= parseInt(value.split(';')[1])
          } else {
            data[key] += parseInt(value.split(';')[1])
          }
        } else {
          data[key] = value;
        }
      } else {
        data[key] = value;
      }
    })
    client.updateGuild(user, data)
    return data;
  },
    client.updateGuild = async (guild, body) => {
      client.configTable.set(guild.id, body)
    }
}