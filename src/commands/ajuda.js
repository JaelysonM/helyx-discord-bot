const { MessageEmbed } = require('discord.js')

const listCommands = async (commands, config) => {
    const prefix = config.prefix;
    return commands.filter(command => command.help.name != 'ajuda').map(command => ` ⠀\`${prefix}${command.help.name}\` ${command.help.description ? command.help.description : 'Sem descrição!'}`).join(' \n');
}

exports.run = async (client, message, args, command) => {

    message.delete()
    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const config = client.configCache.get(message.guild.id);

    const helperRole = message.guild.roles.cache.find(role => role.name == 'AJUDANTE');
    const painel = await message.channel.send(new MessageEmbed()

        .setTitle(`Este processo pode demorar alguns segundos`).setThumbnail(`https://media0.giphy.com/media/Tk25o3pwpdbQqUS8Ht/giphy.gif`)
        .setDescription(`O sistema está coletando suas permissões para conseguir definir quais comandos você pode usar no servidor.`)
        .setColor(`#36393f`))
    const commands = await client.getMemberCommands(message.member);
    const commandsList = await listCommands(commands, config);

    await painel.edit('Coletamos as permissões, carregando painel...', new MessageEmbed()

        .setTitle(`Este processo pode demorar alguns segundos`).setThumbnail(`https://media0.giphy.com/media/Tk25o3pwpdbQqUS8Ht/giphy.gif`)
        .setDescription(`O sistema está coletando suas permissões para conseguir definir quais comandos você pode usar no servidor.`)
        .setColor(`#36393f`))


    if (message.member.roles.highest.rawPosition <= helperRole.rawPosition) {
        painel.edit('', new MessageEmbed()
            .setTitle(`Confira os comandos disponíveis para você!`)
            .setDescription(`O sistema coletou que você tem permissões especificas, com isso você tem acesso aos comandos básicos. Confira-os: \n\n${commandsList}`)
            .setColor(`#36393f`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } });
    } else {
        painel.edit('', new MessageEmbed()
            .setTitle(`Confira os comandos disponíveis para você!`)
            .setDescription(`O sistema coletou que você tem permissões privilegiadas, com isso você tem acesso aos comandos de moderação. Confira-os: \n\n${commandsList}`)
            .setColor(`#36393f`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } });
    }

    try { await painel.delete({ timeout: 1000 * 10 }); } catch (error) { }

}

exports.help = {
    name: 'ajuda',
    aliases: ['help'],
}