const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {

    const embed = new MessageEmbed()

        .setDescription(`As revisões de punição são realizadas por um formulário que pode ser enviado utilizando o link abaixo. \n\n Link: https://bit.ly/revisaoshelds \n Clique [aqui](https://bit.ly/revisaoshelds) para ser redirecionado.`)
        .setColor(`#36393f`)
    message.channel.send(embed).then(msg => { msg.delete({ timeout: 10000 }) })

}

exports.help = {
    name: "revisao"
}