const { MessageEmbed } = require('discord.js')

const { formatDateBR } = require('../utils/dateUtils')

exports.run = async (client, message, args) => {

  message.delete();

  const report = {}

  const config = client.configCache.get(message.guild.id);
  await message.channel.send(new MessageEmbed()
    .setAuthor(`${message.author.username}`, `https://media2.giphy.com/media/ME2ytHL362EbZksvCE/giphy.gif`)
    .setDescription(`Informe o nickname do jogador que deseja denúnciar.\nCaso forneça um nickname falso poderá ser punido!`)).then(async msg => {
      const collector = message.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 1000 * 20, max: 2 });
      collector.on('collect', async (message) => {
        message.delete();
        if (!report.reported) {
          report.reported = message.content;
          await msg.edit(new MessageEmbed()
            .setAuthor(`${message.author.username}`, `https://media2.giphy.com/media/ME2ytHL362EbZksvCE/giphy.gif`).setColor('#fff312').setThumbnail(`https://minotar.net/avatar/${report.reported}`)
            .setDescription(`Jogador à ser denunciado: **${report.reported}**\n\nInforme agora um motivo ou prova para compor sua denúncia;\nNós aceitamos \`\`links, de imagens ou vídeos\`\` como provas.`))
        } else {
          report.reason = message.content;
          await msg.edit(new MessageEmbed()
            .setAuthor(`${message.author.username} - Denúncia completada!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`).setColor('#00ff04').setThumbnail(`https://minotar.net/avatar/${report.reported}`)
            .setDescription(`Jogador à ser denunciado: **${report.reported}**\nMotivo/prova da denúncia: **${report.reason}**\n\nSua denúncia foi criada com sucesso, em instantes ela será encaminhada para nossa equipe, onde ela será analisada.\n`).setFooter('Denúncia feita em ' + formatDateBR(Date.now())))
          const reportChannel = await client.guilds.cache.get(config.attendanceServer).channels.cache.get(config.reportChannel);
          reportChannel.send(new MessageEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator} - Nova denúncia!`, `https://media0.giphy.com/media/geKGJ302nQe60eJnR9/giphy.gif`).setColor('#ff2a00').setThumbnail(`https://minotar.net/avatar/${report.reported}`)
            .setDescription(`|| @everyone ||\nJogador denunciado: **${report.reported}**\nMotivo/prova da denúncia: **${report.reason}**`).setFooter('Denúncia feita em ' + formatDateBR(Date.now()))).then(m => {
              m.react('✅')
              m.react('❌')
            })

        }


      });
      try { await msg.delete({ timeout: 20 * 1000 }) } catch (error) { }
    })

}
exports.help = {
  name: 'denunciar',
  aliases: ['report']
}