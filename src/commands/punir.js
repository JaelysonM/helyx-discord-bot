const { MessageEmbed } = require('discord.js')
const { formatDateBR, formatTimeBR, formatNumber } = require('../utils/dateUtils')


const { toMillis } = require('../utils/timeUtils');

const { isNumber } = require('../utils/methods')

const punishById = (id, punishes) => punishes[id];

const punishesEmbedList = (punishes) => Object.values(punishes).map((item, index) => ` ${formatNumber((index + 1))} » ${item.name}`).join('\n')


module.exports.run = async (client, message, args, command) => {
    if (!client.hasPermission(command, message.member))
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
    if (!client.avaliableUsage(message.guild))
        return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const config = client.configCache.get(message.guild.id);
    let silent = false;

    let member = message.mentions.members.first()
    if (!member) return message.channel.send(`Necessito de um usuário para punir!`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const mute = await client.getAccount(member.user, member.guild);
    if (args.length == 2) silent = args[1].includes('-s') ? true : false;
    if (args.length > 2) silent = args[2].includes('-s') ? true : false;
    if (mute.timestamp != 0 && Date.now() > mute.muteTimestamp) member.roles.remove(config.mutedRole);
    if (mute.muteTimestamp != 0 && member.roles.cache.some(r => [config.mutedRole].includes(r.id))) { message.channel.send(`O jogador \`\`${member.user.username + '#' + member.user.discriminator}\`\`, já está silenciado pelo tempo de \`\`${formatTimeBR(mute.muteTimestamp - Date.now())}\`\``).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } }); return; };
    await message.channel.send(new MessageEmbed().setTitle(`${silent ? `🔕 __Modo silencioso__` : ''}`)
        .setDescription(`Você deve escolher um dos motivos abaixo para confirmar a punição ao membro, basta copiar o ID do motivo e enviar neste canal de texto.\n\n \`\`\`${punishesEmbedList(config.punishes)}\`\`\`\ \nEnvie \`cancelar\` para cancelar a ação que o comando causará sobre o membro, deste modo a punição não será aplicada!`)).then(async msg => {
            const collector = msg.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 10000 * 50, max: 1 });
            collector.on('collect', async (message) => {
                const content = message.content;
                if (content.toLowerCase() != 'cancelar') {
                    const punish = punishById(parseInt(content.toLowerCase()), config.punishes);
                    if (!isNumber(content.toLowerCase()) || (parseInt(content.toLowerCase()) > Object.keys(config.punishes).length) || parseInt(content.toLowerCase) < 0 || !punish) {
                        message.delete();
                        return;
                    }
                    if (!silent)
                        message.guild.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                            .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: ${punish.name} \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                            .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                    client.updateValues(member.user, member.guild, {
                        muteTimestamp: punish.timestamp + Date.now(),
                        punishTimes: 'plus;1'
                    })
                    message.channel.send(new MessageEmbed()
                        .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                        .setDescription(`\nVocê selecionou o motivo \`\`${punish.name}\`\`, o mesmo foi punido com um silenciamento de ${formatTimeBR(punish.timestamp).trim()}.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                    member.roles.add(config.mutedRole);

                } else {
                    collector.stop();
                    try { await msg.delete() } catch (error) { }
                    return message.channel.send(`Você cancelou a punição sobre o usuário!`)
                }
                try { await msg.delete({ timeout: toMillis(15) }) } catch (error) { }
            });


        })

}
exports.help = {
    name: 'punir',
    roles: ['AJUDANTE'],
    description: 'Abre um painel de punição de membros;'
}