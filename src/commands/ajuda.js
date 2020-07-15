const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {

    message.channel.send(new MessageEmbed()

        .setTitle(`Confira os comandos disponível para você!`)
        .setDescription(`O sistema coletou que você tem permissões especificas, com isso você tem acesso aos comandos básicos. Confira-os: \n\n ⠀\`&denunciar\` Envie uma denúncia sobre um jogador para nossa equipe; \n ⠀\`&sugerir\` Envie uma sugestão de algo que queira de ver no servidor; \n ⠀\`&server\` Recebe informações sobre o servidor; \n ⠀\`&revisao\` Recebe o formulário de revisão de punição; \n ⠀\`&formulario\` Recebe o formulário de aplicação a equipe;`)
        .setColor(`#36393f`))

}

exports.help = {
    name: 'ajuda',
    aliases: ['help']
}