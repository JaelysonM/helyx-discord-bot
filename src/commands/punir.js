const Discord = require('discord.js')
const { composeDateBR, hoursToMillis, minutesToMillis, toMillis, daysToMillis, timetoSec } = require('../utils/dateUtils')

const { addMuteDelay, getMuteDelay } = require('../controllers/PunishController');

const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
    message.delete()

    if (!message.member.roles.some(r => ["AJUDANTE", "MODERADOR", "ADMIN", "GERENTE", "MASTER", "SLA.COM"].includes(r.name)))
        return message.channel.send(`Você não possui permissão para executar este comando.`);

    let member = message.mentions.members.first()
    if (!member) return message.channel.send(`Necessito de um usuário para punir!`);

    const mute = await getMuteDelay(member.user);
    if (mute.timestamp != 0 && Date.now() > mute.muteTimestamp) member.removeRole(config.mutedRole);
    if (mute.muteTimestamp != 0 && member.roles.some(r => ['SILENCIADO'].includes(r.name))) { message.channel.send(`O jogador \`\`${member.user.username + '#' + member.user.discriminator}\`\`, já está silenciado pelo tempo de \`\`${timetoSec(mute.muteTimestamp - Date.now())}\`\``).then(m => m.delete(10000)); return; };

    message.channel.send(new Discord.RichEmbed()
        .setDescription(`Você deve escolher um dos motivos abaixo para confirmar a punição ao membro, basta copiar o ID do motivo e enviar neste canal de texto.\n\n \`\`\`\ 01 » Ofensa a membros da equipe.\n 02 » Ofensa a jogadores.\n 03 » Discórdia no bate-papo.\n 04 » Divulgação. (Servidores)\n 05 » Divulgação. (Links)\n 06 » Mensagens falsas/Chat Fake.\n 07 » Comércio não autorizado. \`\`\`\ \nEnvie \`cancelar\` para cancelar a ação que o comando causará sobre o membro, deste modo a punição não será aplicada!`)).then(msg => { msg.delete(toMillis(15)) })

    const collector = message.channel.createMessageCollector(a => a.author.id == message.author.id, { time: 10000 * 50, max: 1 });
    collector.on('collect', async (message) => {
        const content = message.content;

        switch (content) {
            case 'cancelar':
                return message.channel.send(`Você cancelou a punição sobre o usuário!`)
            case '01':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Ofensa a membros da equipe. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));

                addMuteDelay(member.user, daysToMillis(3));
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Ofensa a membros da equipe.\`\`, o mesmo foi punido com um silenciamento de 3 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));

                break;
            case '02':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Ofensa a jogadores. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));
                addMuteDelay(member.user, daysToMillis(50));
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Ofensa a jogadores.\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));


                member.addRole(config.mutedRole);

                break;
            case '03':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Discórdia no bate-papo. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));
                member.addRole(config.mutedRole);
                addMuteDelay(member.user, hoursToMillis(400));
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Discórdia no bate-papo.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));
                break;
            case '04':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Divulgação. (Servidores) \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));
                member.addRole(config.mutedRole);
                addMuteDelay(member.user, daysToMillis(50));
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Divulgação. (Servidores)\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));

                break;
            case '05':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Divulgação. (Links) \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));

                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Divulgação. (Links)\`\`, o mesmo foi punido com um silenciamento de 50 dias.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));

                member.addRole(config.mutedRole);
                addMuteDelay(member.user, daysToMillis(50));
                break;
            case '06':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Mensagem falsa/Chat Fake. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));
                member.addRole(config.mutedRole);
                addMuteDelay(member.user, hoursToMillis(400));
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Mensagem falsa/Chat Fake.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));

                break;
            case '07':
                client.channels.get(config.punishChannel).send(new Discord.RichEmbed()
                    .setDescription(`Um membro foi punido do servidor de discord recentemente, confira abaixo algumas informações sobre a punição, dentre elas quem aplicou, motivo e membro punido.\n⠀\`\`\`\ Membro punido: ${member.user.tag} \n Motivo da punição: Comércio não autorizado. \n Punição aplicada por: ${message.author.tag} \`\`\`\ `)
                    .setFooter('A punição foi aplicada ' + composeDateBR(Date.now())));
                member.addRole(config.mutedRole);
                addMuteDelay(member.user, 1.44e+7);
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Motivo aplicado com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                    .setDescription(`\nVocê selecionou o motivo \`\`Comércio não autorizado.\`\`, o mesmo foi punido com um silenciamento de 400 horas.\n\nCaso se repita o mesmo será punido com o banimento permanente do servidor.`).setFooter(`Essa sua ${(mute.punishTimes + 1)}º punição.`)).then(m => m.delete(5000));

                break;
            default:
                message.delete();
                break;
        }

        if (content == `cancelar`) return message.channel.send(`Você cancelou a punição sobre o usuário!`)
    });
}
exports.help = {
    name: "punir"
}