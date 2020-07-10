const Discord = require('discord.js')

exports.run = async (bot, message, args) => {

const embed = new Discord.RichEmbed()

.setDescription(`As aplicações para a equipe são realizadas por um formulário que pode ser enviado utilizando o link abaixo. \n\n Link: https://bit.ly/formularioredeshelds \n Clique [aqui](https://bit.ly/formularioredeshelds) para ser redirecionado.`)
.setColor(`#36393f`)
let time = 6000; // 6 segundos.
    message.channel.send(embed).then(msg=>{msg.delete(time)})

}

exports.help = {
    name: "formulario"
}