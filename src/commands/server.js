const { MessageEmbed } = require('discord.js')

const api = require('../services/api')


module.exports.run = async (client, message, args) => {

    try {
        const response = await api('redevanish.com').get('');
        message.channel.send(new MessageEmbed()
            .setDescription(`**Status do servidor:** \n Estamos com ${response.body.players.now}/${response.body.players.max} jogadores onlines em todos os servidores da rede. \n\n 🎮 **IP:** \`redeshelds.com\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#36393f`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } })
    } catch (err) {
        console.log(err)
        message.channel.send(new MessageEmbed()
            .setDescription(`**Status do servidor:** \n \`\`API Offline\`\`, não conseguimos pegar as informações do servidor.\n\n 🎮 **IP:** \`redeshelds.com\` \n\n **DICA!** Sempre é bom ter uma segurança, pegue seu pin gerado ao servidor para conseguir recuperar sua conta caso seja furtada ou roubada.`)
            .setColor(`#ff0000`)).then(async message => { try { await message.delete({ timeout: 10000 }) } catch (error) { } })
    }
}
exports.help = {
    name: "server"
}

