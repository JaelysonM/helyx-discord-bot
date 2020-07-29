const { MessageEmbed } = require('discord.js')

const api = require('../services/api')


module.exports.run = async (client, message, args, command) => {
    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
    message.delete();
    const config = client.configCache.get(message.guild.id);
    try {
        const response = await api(config.serverIp).get('');
        message.channel.send(new MessageEmbed()
            .setDescription(`**Status do servidor:** \n Estamos com ${response.data.players.now}/${response.data.players.max} jogadores onlines em todos os servidores da rede. \n\n 🎮 **IP:** \`${config.serverIp}\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#36393f`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } })
    } catch (err) {
        console.log(err)
        message.channel.send(new MessageEmbed()
            .setDescription(`**Status do servidor:** \n \`\`API Offline\`\`, não conseguimos pegar as informações do servidor.\n\n 🎮 **IP:** \`${config.serverIp}\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#ff0000`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } })
    }
}
exports.help = {
    name: 'server',
    description: 'Recebe informações sobre o servidor;'
}

