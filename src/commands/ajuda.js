const Discord = require('discord.js')

exports.run = async (bot, message, args) => {

const embed = new Discord.RichEmbed()

.setTitle(`Confira os comandos disponível para você!`)
.setDescription(`O sistema coletou que você tem permissões expecificas, com isso você tem acesso aos comandos básicos. Confira-os: \n\n ⠀\`&denunciar\` Envie uma denúncia sobre um jogador para nossa equipe; \n ⠀\`&sugerir\` Envie uma sugestão de algo que queira de ver no servidor; \n ⠀\`&server\` Recebe informações sobre o servidor; \n ⠀\`&revisao\` Recebe o formulário de revisão de punição; \n ⠀\`&formulario\` Recebe o formulário de aplicação a equipe;`)
.setColor(`#36393f`)

message.channel.send(embed)

}

exports.help = {
    name: "ajuda"
}