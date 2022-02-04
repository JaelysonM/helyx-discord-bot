const { MessageEmbed } = require('discord.js')

const api = require('../services/api')


module.exports.run = async (client, message, args, command) => {
    if (!client.avaliableUsage(message.guild))
        return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const config = client.configCache.get(message.guild.id);
    try {
        const response = await api(config.serverIp).get('');
        let embed = new MessageEmbed()
        .setDescription(`**Status do servidor:** \n Estamos com ${response.data.players.now}/${response.data.players.max} jogadores onlines em todos os servidores da rede. \n\n 🎮 **IP:** \`${config.serverIp}\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#36393f`)
        message.channel.send({embeds: [embed]})
    } catch (err) {
        console.log(err)
        let embed2 = new MessageEmbed()
        .setDescription(`**Status do servidor:** \n \`\`API Offline\`\`, não conseguimos pegar as informações do servidor.\n\n 🎮 **IP:** \`${config.serverIp}\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#ff0000`)
        message.channel.send({embeds: [embed2]})
    }
}
exports.help = {
    name: 'server',
	aliases: ["ip"],
    description: 'Recebe informações sobre o servidor;'
}

