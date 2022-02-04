const { MessageEmbed } = require('discord.js')

const { toMillis } = require('../utils/timeUtils');

const { formatDateBR } = require('../utils/dateUtils');

exports.run = async (client, message, args, command) => {
    if (!client.hasPermission(command, message.member))
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
    if (!client.avaliableUsage(message.guild))
        return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const config = client.configCache.get(message.guild.id);
    if (!config.reviewsEnabled) {
        return message.channel.send(`🚫 A criação de revisões foi desabilitada por um superior.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
    }
    switch (args.length) {
        case 2:
            const nickname = args[0];
            const status = args[1];

            if (!['aprovada', 'negada'].includes(status.toLowerCase())) {
                message.channel.send(`🚫 Use: ${config.prefix}revisar ${nickname} <Aprovada ou Negada>.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

                return;
            }

            await message.channel.send(new MessageEmbed()
                .setDescription(`Você está prestes a dar o resultado de uma revisão, escolha um dos emojis com os respectivos motivos atuais:\n
                ${status.toLowerCase().includes('negada') ? `\`\`\`📅 » Prazo encerrado.\n🛠️ » Não consta nenhuma punição ativa em sua conta.\n⚒️ » A punição foi aplicada corretamente.\`\`\`` : `\`\`\`⚒️ » A punição foi aplicada corretamente.\`\`\``}
Você terá \`\`10 segundos\`\` para escolher um motivo para a revisão de **${nickname}**\n para o status ***${status}***!`
                ).setFooter(`Punição à ser revisada ${formatDateBR(Date.now())}`)).then(async msg => {
                    if (status.toLowerCase().includes('negada')) {
                        msg.react('📅')
                        msg.react('🛠️')
                    }

                    msg.react('⚒️')

                    const filter = (reaction, user) => {
                        return user.id == message.author.id && (reaction.emoji.name == '🛠️' || reaction.emoji.name == '⚒️' || reaction.emoji.name == '📅');
                    };
                    const collector = msg.createReactionCollector(filter, { time: 1000 * 10, max: 1 });

                    collector.on('collect', async (reaction, reactionCollector) => {
                        reaction.users.remove(message.author)

                        const appelChannel = await client.guilds.cache.get(config.mainServer).channels.cache.get(config.appelChannel);

                        let reason = undefined;
                        switch (reaction.emoji.name) {
                            case '📅': reason = 'Prazo encerrado.'; break;
                            case '🛠️':
                                reason = 'Não consta nenhuma punição ativa em sua conta.'; break;
                            case '⚒️':
                                reason = 'A punição foi aplicada corretamente.'; break;
                        }
                        if (reason) {
                            message.channel.send(new MessageEmbed()
                                .setAuthor(`Revisão efetuada com sucesso!`, `https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/0f/Lime_Dye_JE2_BE2.png/150px-Lime_Dye_JE2_BE2.png?version=689addf38f5c21626ee91ec07e6e8670`)
                                .setDescription(`\nVocê selecionou o motivo \`\`${reason}\`\` e este resultado da revisão foi notificado no canal #revisões em nosso servidor principal;`).setFooter(`O resultado da revisão foi enviada ${formatDateBR(Date.now())}`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } });

                            appelChannel.send(new MessageEmbed().setDescription(`Um membro punido no servidor recentemente acabou de receber o resultado de
                         sua revisão, confira abaixo algumas informações sobre a revisão, dentre elas
                         membro punido, status e motivo.   
                         \`\`\` Membro: ${nickname}.\n Status da revisão: ${status}.\n Motivo: ${reason}\`\`\``).setFooter(`O resultado da revisão foi enviada ${formatDateBR(Date.now())}`))
                        }
                    });
                    try { await msg.delete({ timeout: toMillis(10) }) } catch (error) { }
                })
            break;
        default:
            return message.channel.send(`🚫 Use: ${config.prefix}revisar < nome do usuário > <resultado da revisão>.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

            break;
    }

}

exports.help = {
    name: 'revisar',
    roles: ['ADMINISTRADOR'],
    description: 'Responda a o pedido de revisão de um jogador;'
}