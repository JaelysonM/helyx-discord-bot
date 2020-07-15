const { MessageEmbed, MessageAttachment } = require('discord.js')
const { downloadFile } = require('../utils/fileUtils')
const { formatDateBR } = require('../utils/dateUtils')

const { sleep } = require('../utils/fileUtils')

const fs = require('fs')


exports.run = async (client, message, args) => {
  message.delete();

  const guild = await client.getGuild(message.guild);
  const mappedGuild = Object.values(guild).filter(result => result != null);


  await message.channel.send(new MessageEmbed()
    .setAuthor(`Atualização de configurações`, `https://media2.giphy.com/media/ME2ytHL362EbZksvCE/giphy.gif`)
    .setFooter(`Tentativa de configuração iniciada em ${formatDateBR(Date.now())}`).setColor('#ffd500').setImage(`https://minecraftskinstealer.com/achievement/11/${message.author.username}/Envie+um+arquivo+.json%21`)
    .setDescription(`\n\nVocê iniciou a **configuração** do servidor:\`\`\`fix\n${message.guild.name} ● (${parseFloat((mappedGuild.length / Object.keys(client.defaultConfigBody).length) * 100).toFixed(2).replace('.00', '') + '% configurado)'} \`\`\`\nComo existem muitas opções de customização, achamos mais cômodo você envia-lás por um arquivo __**json**__, caso você queira algum arquivo de base [clique aqui](https://bit.ly/2Orv3nX).\n\nReaja com  ❌  para cancelar, ou aguarde \`\`20s\`\` para **cancelar automaticamente**.\n\nDeseja baixar as configurações atuais? reaja com 🧾!`)).then(async msg => {
      msg.react('❌')
      msg.react('🧾')
      const filter = (reaction, user) => {
        return user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '🧾');
      };
      const collector = message.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 1000 * 20, max: 1 });
      const collectorReaction = msg.createReactionCollector(filter, { time: 1000 * 20, max: 1 });

      collectorReaction.on('collect', async (reaction, reactionCollector) => {
        if (reaction.message.deleted) return;
        reaction.users.remove(message.author)
        switch (reaction.emoji.name) {
          case '❌':
            message.channel.send(`> 📌 Você cancelou a configuração do servidor!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
            reaction.message.delete();
            break;
          case '🧾':
            message.channel.send(`> 📌 Você baixou as configurações atuais do servidor!`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })
            reaction.message.delete();
            fs.writeFileSync(`./cache/server_settings.json`, JSON.stringify(await client.getGuild(message.guild), null, '\t'), 'utf8')
            const attachment = new MessageAttachment('./cache/server_settings.json');
            message.channel.send(attachment).then(async message => { try { await message.delete({ timeout: 1000 * 60 }) } catch (error) { } })
            await sleep(500);
            fs.unlinkSync('./cache/server_settings.json');
            break;
        }
      });

      collector.on('collect', async (collectMessage) => {

        if (message == null) return;

        const file = collectMessage.attachments.first();

        if (file) {
          if (!file.name.endsWith('.json')) {
            collectMessage.reply(`🚫 Arquivo inválido! ${file.name} deve ser um arquivo .json!`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })
            return;
          }
          const fileName = `${Date.now()}__settings.json`
          try {

            const json = await downloadFile(file.attachment, 'cache', fileName)
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
            msg.edit(new MessageEmbed()
              .setAuthor(`Configurações atualizadas!`, `https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif`)
              .setColor('#00f7ff')
              .setImage(`https://minecraftskinstealer.com/achievement/2/Foram+feitas/${Object.keys(json).length}+${Object.keys(json).length < 2 ? 'alteração' : 'alterações'}`)
              .setDescription(`\n\nVocê alterou as ** configurações ** do servidor: \`\`\`css\n${collectMessage.guild.name} \`\`\``).addField('**Alterações realizadas:**', `${composeChanges()}`))

            collectMessage.delete();
          } catch (err) {
            collectMessage.reply(`🚫 Arquivo inválido! ${file.name} não contem o formato padrão de um arquivo .json.`).then(async message => { try { await message.delete({ timeout: 1500 }) } catch (error) { } })
            collectMessage.delete();
          }

        } else {
          collectMessage.reply('🚫 Não existe nenhum arquivo nessa mensagem enviada.').then(m => m.delete({ timeout: 1500 }))
          collectMessage.delete();
        }

      });

      try { await msg.delete({ timeout: 20 * 1000 }) } catch (error) { }



    }
    )
}
exports.help = {
  name: 'config'
}