const { MessageEmbed, MessageAttachment } = require('discord.js')
const { downloadFile } = require('../utils/fileUtils')
const { formatDateBR } = require('../utils/dateUtils')

const { sleep } = require('../utils/fileUtils')

const fs = require('fs')


exports.run = async (client, message, args, command) => {

  if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`Você não tem permissão para usar este comando`);
  const guild = await client.getGuild(message.guild);
  const mappedGuild = Object.values(guild).filter(result => result != null);

  let embed = new MessageEmbed()
  .setAuthor({name: `Atualização de configurações`, iconURL: `https://media2.giphy.com/media/ME2ytHL362EbZksvCE/giphy.gif`})
  .setFooter({text:`Tentativa de configuração iniciada em ${formatDateBR(Date.now())}`})
  .setColor('#ffd500')
  .setImage(`https://minecraftskinstealer.com/achievement/11/${message.author.username}/Envie+um+arquivo+.json%21`)
  .setDescription(`\n\nVocê iniciou a **configuração** do servidor:\`\`\`fix\n${message.guild.name} ● (${parseFloat((mappedGuild.length / Object.keys(client.defaultConfigBody).length) * 100).toFixed(2).replace('.00', '') + '% configurado)'} \`\`\`\nComo existem muitas opções de customização, achamos mais cômodo você envia-lás por um arquivo __**json**__, caso você queira algum arquivo de base [clique aqui](https://bit.ly/2Orv3nX).\n\nReaja com  ❌  para cancelar, ou aguarde \`\`20s\`\` para **cancelar automaticamente**.\n\nDeseja baixar as configurações atuais? reaja com 🧾!`)
  
  await message.channel.send({embeds: [embed]}).then(async msg => {
        await msg.react('❌')
        await msg.react('🧾')
      const filter = (reaction, user) => {
        return user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '🧾');
      };

      
      const collector = message.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 1000 * 20, max: 1 });
      const collectorReaction = msg.createReactionCollector(filter, { time: 1000 * 20, max: 1 });

      
      collectorReaction.on('collect', async (reaction) => {
        reaction.users.remove(message.author)
        switch (reaction.emoji.name) {
          case '❌':
            try { await message.delete(); } catch (error) { }
            message.channel.send(`> 📌 Você cancelou a configuração do servidor!`)
            collector.stop();
            break;
          case '🧾':
            collector.stop();
            message.channel.send(`> 📌 Você baixou as configurações atuais do servidor!`)
            fs.writeFileSync(`./server_settings.json`, JSON.stringify(await client.getGuild(message.guild), null, '\t'), 'utf8')
            const attachment = new MessageAttachment('./server_settings.json');
            message.channel.send(attachment).then(async message => { try { await message.delete({ timeout: 1000 * 60 }) } catch (error) { } })
            await sleep(500);
            fs.unlinkSync('./server_settings.json');
            try { await message.delete(); } catch (error) { }
            break;
        }
      });

      collector.on('collect', async (collectMessage) => {

        const file = collectMessage.attachments.first();

        if (file) {
          if (!file.name.endsWith('.json')) {
            collectMessage.reply(`🚫 Arquivo inválido! ${file.name} deve ser um arquivo .json!`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })
            return;
          }
          const fileName = `${Date.now()}_settings.json`
          try {

            const json = await downloadFile(file.attachment, 'bot-cache', fileName)
            const configuration = await client.updateGuildValues(collectMessage.guild, json);
            client.configCache.set(collectMessage.guild.id, configuration);


            const composeChanges = () => {
              if (Object.keys(json).length == 0) { return `\`\`\`css\n[Não há alterações]\`\`\`` }

              if (Object.keys(json).length <= 5) {
                return `\`\`\`json\n${Object.keys(json).map(key => `✔ "${key}"`).join('\n')}\`\`\``
              } else {
                return `\`\`\`json\n${Object.keys(json).slice(0, 5).map(key => `✔ "${key}"`).join('\n')}\n\noutros ${Object.keys(json).length - 5}...\`\`\``
              }
            }

            msg.reactions.removeAll()
            let embed2 = new MessageEmbed()
              .setAuthor({name:`Configurações atualizadas!`, iconURL: `https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif`})
              .setColor('#00f7ff')
              .setImage(`https://minecraftskinstealer.com/achievement/2/Foram+feitas/${Object.keys(json).length}+${Object.keys(json).length < 2 ? 'alteração' : 'alterações'}`)
              .setDescription(`\n\nVocê alterou as ** configurações ** do servidor: \`\`\`css\n${collectMessage.guild.name} \`\`\``).addField('**Alterações realizadas:**', `${composeChanges()}`)

            msg.edit({embeds: [embed2]})

            try { await collectMessage.delete(); } catch (error) { }
            collectorReaction.stop();
          } catch (err) {
            collectorReaction.stop();
            collectMessage.reply(`🚫 Arquivo inválido! ${file.name} não contem o formato padrão de um arquivo .json.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })
            try { await collectMessage.delete(); } catch (error) { }
          }

        } else {
          collectorReaction.stop();
          collectMessage.reply('🚫 Não existe nenhum arquivo nessa mensagem enviada.').then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })
          try { await collectMessage.delete(); } catch (error) { }
        }

      });

    }
    )
}
exports.help = {
  name: 'config',
  roles: ['POLAR'],
  description: 'Abre um painel de configurações do servidor;'
}