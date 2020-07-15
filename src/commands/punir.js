const { MessageEmbed } = require('discord.js')
const { formatDateBR, formatTimeBR } = require('../utils/dateUtils')

const { toMillis, hoursToMillis, daysToMillis } = require('../utils/timeUtils');

module.exports.run = async (client, message, args) => {
    message.delete()

    const config = client.configCache.get(message.guild.id);
    if (!message.member.roles.cache.some(r => ["AJUDANTE", "MODERADOR", "ADMIN", "GERENTE", "MASTER", "SLA.COM", "MANAGER"].includes(r.name)))
        return message.channel.send(`Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    let member = message.mentions.members.first()
    if (!member) return message.channel.send(`Necessito de um usuário para punir!`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const mute = await client.getAccount(member.user, member.guild);
    if (mute.timestamp != 0 && Date.now() > mute.muteTimestamp) member.roles.remove(config.mutedRole);
    if (mute.muteTimestamp != 0 && member.roles.cache.some(r => ['SILENCIADO'].includes(r.name))) { message.channel.send(`O jogador \`\`${member.user.username + '#' + member.user.discriminator}\`\`, já está silenciado pelo tempo de \`\`${formatTimeBR(mute.muteTimestamp - Date.now())}\`\``).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } }); return; };

    await message.channel.send(new MessageEmbed()
        .setDescription(`Você deve escolher um dos motivos abaixo para confirmar a punição ao membro, basta copiar o ID do motivo e enviar neste canal de texto.\n\n \`\`\`\ 01 » Ofensa a membros da equipe.\n 02 » Ofensa a jogadores.\n 03 » Discórdia no bate-papo.\n 04 » Divulgação. (Servidores)\n 05 » Divulgação. (Links)\n 06 » Mensagens falsas/Chat Fake.\n 07 » Comércio não autorizado. \`\`\`\ \nEnvie \`cancelar\` para cancelar a ação que o comando causará sobre o membro, deste modo a punição não será aplicada!`)).then(async message => { try { await message.delete({ timeout: toMillis(15) }) } catch (error) { } })

    const collector = message.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 10000 * 50, max: 1 });
    collector.on('collect', async (message) => {
        const content = message.content;
        switch (content) {
            case 'cancelar':
                return message.channel.send(`Você cancelou a punição sobre o usuário!`)
            case '01':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Ofensa a membros da equipe. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: daysToMillis(3),
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Ofensa a membros da equipe.\`\`, o mesmo foi punido com um silenciamento de 3 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                member.roles.add(config.mutedRole);
                break;
            case '02':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Ofensa a jogadores. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: daysToMillis(50),
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Ofensa a jogadores.\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                member.roles.add(config.mutedRole);

                break;
            case '03':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Discórdia no bate-papo. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                member.roles.add(config.mutedRole);
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: hoursToMillis(400),
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Discórdia no bate-papo.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                break;
            case '04':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Divulgação. (Servidores) \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                member.roles.add(config.mutedRole);
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: daysToMillis(50),
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Divulgação. (Servidores)\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });

                break;
            case '05':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Divulgação. (Links) \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));

                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Divulgação. (Links)\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                member.roles.add(config.mutedRole);
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: daysToMillis(50),
                    punishTimes: 'plus;1'
                })
                break;
            case '06':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Mensagem falsa/Chat Fake. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                member.roles.add(config.mutedRole);
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: hoursToMillis(400),
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Mensagem falsa/Chat Fake.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                break;
            case '07':
                client.channels.cache.get(config.punishChannel).send(new MessageEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Comércio não autorizado. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + formatDateBR(Date.now())));
                member.roles.add(config.mutedRole);
                client.updateValues(member.user, member.guild, {
                    muteTimestamp: 1.44e+7,
                    punishTimes: 'plus;1'
                })
                message.channel.send(new MessageEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Comércio não autorizado.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } });
                break;
            default:
                message.delete();
                break;
        }
    });
}
exports.help = {
    name: 'punir',
}