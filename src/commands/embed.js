const { MessageEmbed } = require('discord.js')

module.exports.run = async (client, message, args, command) => {

    message.delete();

    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    await message.author.createDM()

    let titulo = new MessageEmbed()
        .setAuthor(`Embed`, client.user.avatarURL)
        .setDescription(`\n\u200bQual título você deseja para enviar o embed?`)
        .setFooter(`© RedeShelds - Todos os direitos reservados!`)
        .setColor(`#00FFFF`)

    message.author.send(titulo).then(async msg => {
        var collector = message.author.dmChannel.createMessageCollector(a => a.author.id == message.author.id, { time: 120000, max: 1 })
        collector.on('collect', a => {
            var título = a.content

            let desc = new MessageEmbed()
                .setAuthor(`Embed`, client.user.avatarURL)
                .setDescription(`\n\u200bQual descrição você deseja para enviar o anúncio?`)
                .setFooter(`© RedeShelds - Todos os direitos reservados!`)
                .setColor(`#00FFFF`)

            message.author.send(desc)
            var collector = message.author.dmChannel.createMessageCollector(a => a.author.id == message.author.id, { time: 120000, max: 1 })
            collector.on('collect', async a => {
                var descrição = a.content

                let img = new MessageEmbed()
                    .setAuthor(`Embed`, client.user.avatarURL)
                    .setDescription(`\n\u200bVocê deseja adicionar uma imagem no seu anúncio?\n\nA imagem deve ser dada em link, \`https://cdn.discordapp.com/attachments/710494208011665430/711933023293014178/2fd49f3414c69c257883bc473bfdca55.png\`, desse tipo!\n\nCaso você não queira enviar uma imagem, digite \`nao\` no chat.\n\u200b`)
                    .setImage(`https://cdn.discordapp.com/attachments/710494208011665430/711933023293014178/2fd49f3414c69c257883bc473bfdca55.png`)
                    .setFooter(`© RedeShelds - Todos os direitos reservados!`)
                    .setColor(`#00FFFF`)

                message.author.send(img)
                var collector = message.author.dmChannel.createMessageCollector(a => a.author.id == message.author.id, { time: 120000, max: 1 })
                collector.on('collect', async a => {
                    var imagem = a.content

                    if (imagem == `nao`) {

                        let embed = new MessageEmbed()
                            .setTitle(`${título}`)
                            .setDescription(`󠂪󠂪${descrição}\n`)
                            .setFooter(`© RedeShelds - Todos os direitos reservados!`)
                            .setColor(`#36393f`)
                            .setTimestamp()

                        await message.author.send(`Preview do Embed`, embed)

                        message.author.send(`🚫 Para enviar este embed, digite \`confirmar\`, para cancelar digite \`cancelar\`.`)
                        var collector = message.author.dmChannel.createMessageCollector(a => a.author.id == message.author.id, { time: 120000, max: 1 })
                        collector.on('collect', async a => {
                            var cancelamento = a.content

                            if (cancelamento == `confirmar`) {

                                message.channel.send(embed).then(async msg => {
                                });

                                message.author.send(`Embed enviado com sucesso!`)

                            }

                            if (cancelamento == `cancelar`) {
                                return message.author.send(`🚫 Você cancelou o envio do embed!`)
                            }


                        })
                    } else {

                        let embedimagem = new MessageEmbed()
                            .setTitle(`${título}`)
                            .setDescription(`${descrição}\n`)
                            .setFooter(`© RedeShelds - Todos os direitos reservados!`)
                            .setImage(`${imagem}`)
                            .setColor(`#36393f`)
                            .setTimestamp()

                        await message.author.send(`**Pré-Visualização**`, embedimagem)

                        message.author.send(`Para enviar este embed, digite \`confirmar\`, para cancelar digite \`cancelar\`.`)
                        var collector = message.author.dmChannel.createMessageCollector(a => a.author.id == message.author.id, { time: 120000, max: 1 })
                        collector.on('collect', async a => {
                            var cancelamento = a.content

                            if (cancelamento == `confirmar`) {

                                message.channel.send(embedimagem).then(async msg => {
                                    await msg.react('📷')
                                });

                                message.author.send(`Embed enviado com sucesso!`)

                            }

                            if (cancelamento == `cancelar`) {
                                return message.author.send(`🚫 Você cancelou o envio do embed!`)
                            }

                        })
                    }

                })
            })
        })
    }).catch(async () => message.channel.send(`Você está com o privado fechado, por favor abra para eu enviar as informações!`));
}
exports.help = {
    name: "embed",
    roles: ['GERENTE'],
    description: 'Crie um embed facilmente;'
}