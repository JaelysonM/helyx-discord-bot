const { MessageEmbed, MessageCollector } = require('discord.js')

const { formatDateBR } = require('../utils/dateUtils')

const { isNumber } = require('../utils/methods');
const updateEmbedTickets = (message, config) => {
  message.edit(new MessageEmbed().setTitle(`Configurações dos tickets!`)
    .setDescription(`De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n⏰ » Intervalo na criação "${config.ticketDelay ? 'Ativado' : 'Desativado'}"\n⚙ » Criação de tickets "${config.ticketsEnabled ? 'Ativado' : 'Desativado'}"\n🛢 » Capacidade da central "${config.ticketsCapacity + ' tickets'}"\n\n❌ » Encerre o painel do configuração!\`\`\``)
    .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/13/Configura%C3%A7%C3%B5es+tickets%3A/Reaja+com+um+emote%21`))

}
const updateEmbedSystems = (message, config) => {
  message.edit(new MessageEmbed().setTitle(`Configuração de sistemas a parte!`)
    .setDescription(`De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n🚫 » Criação de denúncias "${config.reportsEnabled ? 'Ativado' : 'Desativado'}"\n👀 » Criação de revisões "${config.reviewsEnabled ? 'Ativado' : 'Desativado'}"\n\n❌ » Encerre o painel do configuração!\`\`\``)
    .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/1/Conf.%20Sistemas%20a%20parte:/Reaja+com+um+emote%21`))

}
const updatedEmbedInternal = (message, config) => {
  message.edit(new MessageEmbed().setTitle(`Configurações internas!`)
    .setDescription(
      `De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n⚠ » É o servidor principal? "${config.isMainServer ? 'Sim' : 'Não'}"\n☝ » ID do servidor principal "${config.mainServer ? config.mainServer : 'Não registrado...'}"\n📞 » ID do servidor de atendimento "${config.attendanceServer ? config.attendanceServer : 'Não registrado'}"\n🧾 » Altere a descrição do revisão!\n\n❌ » Encerre o painel do configuração!\`\`\``)
    .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/13/Configura%C3%A7%C3%B5es+tickets%3A/Reaja+com+um+emote%21`))

}


exports.run = async (client, message, args, command) => {

  message.delete();
  if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
  const config = client.configCache.get(message.guild.id);

  await message.channel.send(new MessageEmbed().setTitle(`Painel de configuração rápida do servidor!`)
    .setDescription(`De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações por este painel.\n\n**Reaja com um emote específico para cada setor:**\n\`\`\`🎫 » Configurações dos tickets!\n🔒 » Configurações internas!\n🔧 » Configuração de sistemas a parte!\n\n❌ » Encerre o painel do configuração!\`\`\``)
    .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/19/Configura%C3%A7%C3%B5es+r%C3%A1pidas%21/Reaja+com+um+emote%21`)).then(async msg => {
      try {
        await msg.react('🎫')
        msg.react('🔒')
        msg.react('🔧')
        msg.react('❌')
      } catch (error) { }
      const filter = (reaction, user) => {
        return user.id == message.author.id;
      };
      //isMainServer
      //mainServer
      //attendanceServer
      //reviewDescription
      let currentState = null;
      const reactionCollector = msg.createReactionCollector(filter, { time: 1000 * 60 * 2 });

      reactionCollector.on('collect', async (reaction, user) => {
        switch (reaction.emoji.name) {
          case '❌':
            try { await reaction.message.delete(); } catch (error) { }
            message.channel.send(`> 📌 Você cancelou a configuração rápida do servidor!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
            reactionCollector.stop();
            break;
          case '🔒':
            currentState = 'INTERNAL';
            msg.reactions.removeAll();
            msg.edit(new MessageEmbed().setTitle(`Configurações internas!`)
              .setDescription(
                `De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n⚠ » É o servidor principal? "${config.isMainServer ? 'Sim' : 'Não'}"\n☝ » ID do servidor principal "${config.mainServer ? config.mainServer : 'Não registrado...'}"\n📞 » ID do servidor de atendimento "${config.attendanceServer ? config.attendanceServer : 'Não registrado'}"\n🧾 » Altere a descrição do revisão!\n\n❌ » Encerre o painel do configuração!\`\`\``)
              .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/13/Configura%C3%A7%C3%B5es+tickets%3A/Reaja+com+um+emote%21`))
            try {
              await msg.react('⚠');
              msg.react('☝')
              msg.react('📞')
              msg.react('🧾')
              msg.react('❌')

            } catch (error) { }
            break;
          case '⚠':
            reaction.users.remove(user);
            if (currentState == 'INTERNAL') {
              config.isMainServer = !config.isMainServer;
              const configuration = await client.updateGuildValues(message.guild, config);
              client.configCache.set(message.guild.id, configuration);
              updateEmbedSystems(msg, config)
            }
            break;
          case '☝':
            reaction.users.remove(message.author);
            if (currentState == 'INTERNAL') {

              await message.channel.send(new MessageEmbed().setTitle(`Escreva o ID que deseja!`).setDescription(`\nVocê pode escolher o ID do servidor principal.\n\n**OBS:** Para cancelar essa modificação digite \`\`cancelar\`\`.`)).then(async msgPainel => {
                const messageCollector = msgPainel.channel.createMessageCollector(m => m.author.id == message.author.id, { time: 1000 * 10, max: 1 });
                messageCollector.on('collect', async (collectMessage) => {
                  const content = collectMessage.content;
                  switch (content.toLowerCase()) {
                    case 'cancelar':
                      collectMessage.delete();
                      collectMessage.reply(`> 📌 Você cancelou a alteração da ID do servidor principal!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
                      try { await msgPainel.delete(); } catch (error) { }
                      break;
                    default:
                      collectMessage.delete();
                      messageCollector.stop();
                      config.mainServer = content;
                      const configuration = await client.updateGuildValues(message.guild, config);
                      client.configCache.set(message.guild.id, configuration);
                      updatedEmbedInternal(msg, config)
                      collectMessage.reply(`✅ O ID do servidor principal foi alterado para: ${content}.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })

                      try { await msgPainel.delete(); } catch (error) { }

                      break;
                  }
                });
                try { await msg.delete({ timeout: 1000 * 10 }) } catch (error) { }
              })

            }
            break;
          case '📞':
            reaction.users.remove(message.author);
            if (currentState == 'INTERNAL') {

              await message.channel.send(new MessageEmbed().setTitle(`Escreva o ID que deseja!`).setDescription(`\nVocê pode escolher o ID do servidor de atendimento.\n\n**OBS:** Para cancelar essa modificação digite \`\`cancelar\`\`.`)).then(async msgPainel => {
                const messageCollector = msgPainel.channel.createMessageCollector(m => m.author.id == message.author.id, { time: 1000 * 10, max: 1 });
                messageCollector.on('collect', async (collectMessage) => {
                  const content = collectMessage.content;
                  switch (content.toLowerCase()) {
                    case 'cancelar':
                      collectMessage.delete();
                      collectMessage.reply(`> 📌 Você cancelou a alteração da ID do servidor de atendimento!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
                      try { await msgPainel.delete(); } catch (error) { }
                      break;
                    default:
                      collectMessage.delete();
                      messageCollector.stop();
                      config.attendanceServer = content;
                      const configuration = await client.updateGuildValues(message.guild, config);
                      client.configCache.set(message.guild.id, configuration);
                      updatedEmbedInternal(msg, config)
                      collectMessage.reply(`✅ O ID do servidor de atendimento foi alterado para: ${content}.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })

                      try { await msgPainel.delete(); } catch (error) { }

                      break;
                  }
                });
                try { await msg.delete({ timeout: 1000 * 10 }) } catch (error) { }
              })

            }
            break;
          case '🧾':
            reaction.users.remove(message.author);
            if (currentState == 'INTERNAL') {

              await message.channel.send(new MessageEmbed().setTitle(`Escreva a descrição que deseja!`).setDescription(`\nVocê pode escolher a descrição da revisão.\n\n**OBS:** Para cancelar essa modificação digite \`\`cancelar\`\`.`)).then(async msgPainel => {
                const messageCollector = msgPainel.channel.createMessageCollector(m => m.author.id == message.author.id, { time: 1000 * 10, max: 1 });
                messageCollector.on('collect', async (collectMessage) => {
                  const content = collectMessage.content;
                  switch (content.toLowerCase()) {
                    case 'cancelar':
                      collectMessage.delete();
                      collectMessage.reply(`> 📌 Você cancelou a alteração da descrição da revisão!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
                      try { await msgPainel.delete(); } catch (error) { }
                      break;
                    default:
                      collectMessage.delete();
                      messageCollector.stop();
                      config.attendanceServer = content;
                      const configuration = await client.updateGuildValues(message.guild, config);
                      client.configCache.set(message.guild.id, configuration);
                      updatedEmbedInternal(msg, config)
                      collectMessage.reply(`✅ O ID do servidor de atendimento foi alterado para: ${content}.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })

                      try { await msgPainel.delete(); } catch (error) { }

                      break;
                  }
                });
                try { await msg.delete({ timeout: 1000 * 10 }) } catch (error) { }
              })

            }
            break;
          case '🎫':
            currentState = 'TICKET';
            msg.reactions.removeAll();
            msg.edit(new MessageEmbed().setTitle(`Configurações dos tickets!`)
              .setDescription(`De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n⏰ » Intervalo na criação "${config.ticketDelay ? 'Ativado' : 'Desativado'}"\n⚙ » Criação de tickets "${config.ticketsEnabled ? 'Ativado' : 'Desativado'}"\n🛢 » Capacidade da central "${config.ticketsCapacity + ' tickets'}"\n\n❌ » Encerre o painel do configuração!\`\`\``)
              .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/13/Configura%C3%A7%C3%B5es+tickets%3A/Reaja+com+um+emote%21`))
            try {
              await msg.react('⏰');
              msg.react('⚙')
              msg.react('🛢')
              msg.react('❌')

            } catch (error) { }
            break;
          case '🚫':
            reaction.users.remove(user);
            if (currentState == 'OFF_SECTOR') {
              config.reportsEnabled = !config.reportsEnabled;
              const configuration = await client.updateGuildValues(message.guild, config);
              client.configCache.set(message.guild.id, configuration);
              updateEmbedSystems(msg, config)
            }
            break;
          case '👀':
            reaction.users.remove(message.author);
            if (currentState == 'OFF_SECTOR') {
              config.reviewsEnabled = !config.reviewsEnabled;
              const configuration = await client.updateGuildValues(message.guild, config);
              client.configCache.set(message.guild.id, configuration);
              updateEmbedSystems(msg, config)
            }
            break;
          case '🔧':
            currentState = 'OFF_SECTOR';
            msg.reactions.removeAll();
            msg.edit(new MessageEmbed().setTitle(`Configuração de sistemas a parte!`)
              .setDescription(`De acordo com suas permissões, você pode ativar ou desativar alguns sistemas além de conseguir alterar configurações deste setor.\n\n**Reaja com um emote específico para ação:**\n\n\`\`\`json\n🚫 » Criação de denúncias "${config.reportsEnabled ? 'Ativado' : 'Desativado'}"\n👀 » Criação de revisões "${config.reviewsEnabled ? 'Ativado' : 'Desativado'}"\n\n❌ » Encerre o painel do configuração!\`\`\``)
              .setFooter(`Painel de configuração rápida iniciado em ${formatDateBR(Date.now())}`).setImage(`https://minecraftskinstealer.com/achievement/1/Conf.%20Sistemas%20a%20parte:/Reaja+com+um+emote%21`))
            try {
              await msg.react('🚫');
              msg.react('👀')
              msg.react('❌')

            } catch (error) { }
            break;
          case '⏰':
            reaction.users.remove(message.author);
            if (currentState == 'TICKET') {
              config.ticketDelay = !config.ticketDelay;
              const configuration = await client.updateGuildValues(message.guild, config);
              client.configCache.set(message.guild.id, configuration);
              updateEmbedTickets(msg, config)
            }
            break;
          case '⚙':
            reaction.users.remove(message.author);
            if (currentState == 'TICKET') {
              config.ticketsEnabled = !config.ticketsEnabled;
              const configuration = await client.updateGuildValues(message.guild, config);
              client.configCache.set(message.guild.id, configuration);
              updateEmbedTickets(msg, config)
            }
            break;
          case '🛢':
            reaction.users.remove(message.author);
            if (currentState == 'TICKET') {

              await message.channel.send(new MessageEmbed().setTitle(`Escreva a quantia que deseja!`).setDescription(`\nVocê pode escolher um limite de tickets, apenas escrevendo o número no chat de __1 até 200__.\n\n**OBS:** Para cancelar essa modificação digite \`\`cancelar\`\`.`)).then(async msgPainel => {
                const messageCollector = msgPainel.channel.createMessageCollector(m => m.author.id == message.author.id, { time: 1000 * 10, max: 1 });
                messageCollector.on('collect', async (collectMessage) => {
                  const content = collectMessage.content;
                  switch (content.toLowerCase()) {
                    case 'cancelar':
                      collectMessage.delete();
                      collectMessage.reply(`> 📌 Você cancelou a alteração da quantidade máxima de tickets!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
                      try { await msgPainel.delete(); } catch (error) { }
                      break;
                    default:
                      collectMessage.delete();
                      messageCollector.stop();
                      if (isNumber(content) && parseInt(content) <= 200 && parseInt(content) > 0) {
                        const quantity = parseInt(content);
                        config.ticketsCapacity = quantity;
                        const configuration = await client.updateGuildValues(message.guild, config);
                        client.configCache.set(message.guild.id, configuration);
                        updateEmbedTickets(msg, config)
                        collectMessage.reply(`✅ O número máximo de tickets foi alterado para ${content}.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })

                        try { await msgPainel.delete(); } catch (error) { }
                      } else {
                        collectMessage.reply(`🚫 ${content} não se trata de um número entre 1 e 200.\n\nA alteração foi cancelada \`\`automaticamente\`\`.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })

                        try { await msgPainel.delete(); } catch (error) { }

                      }
                      break;
                  }
                });
                try { await msg.delete({ timeout: 1000 * 10 }) } catch (error) { }
              })

            }
            break;
        }
      })

    });


}
exports.help = {
  name: 'dashboard',
  aliases: ['dshbd'],
  roles: ['MASTER'],
  description: 'Abra o painel de configurações rápidas;'
}