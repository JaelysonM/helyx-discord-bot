const Discord = require('discord.js')

exports.run = async (bot, message, args) => {

const embed = new Discord.RichEmbed()

.setDescription(`As revisões de punição são realizadas por um formulário que pode ser enviado utilizando o link abaixo. \n\n Link: https://bit.ly/revisaoshelds \n Clique [aqui](https://bit.ly/revisaoshelds) para ser redirecionado.`)
.setColor(`#36393f`)
let time = 6000; // 10 segundos.
    message.channel.send(embed).then(msg=>{msg.delete(time)})

}

exports.help = {
    name: "revisao"
}