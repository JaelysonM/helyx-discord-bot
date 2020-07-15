const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {

    const embed = new MessageEmbed()

        .setDescription(`As aplicações para a equipe são realizadas por um formulário que pode ser enviado utilizando o link abaixo. \n\n Link: https://bit.ly/formularioredeshelds \n Clique [aqui](https://bit.ly/formularioredeshelds) para ser redirecionado.`)
        .setColor(`#36393f`)
    message.channel.send(embed).then(async message => { try { await message.delete({ timeout: 6000 }) } catch (error) { } })

}

exports.help = {
    name: "formulario"
}