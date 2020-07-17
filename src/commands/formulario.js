const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, command) => {
    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) !== undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const embed = new MessageEmbed()

        .setDescription(`As aplicações para a equipe são realizadas por um formulário que pode ser enviado utilizando o link abaixo. \n\n Link: https://bit.ly/formularioredeshelds \n Clique [aqui](https://bit.ly/formularioredeshelds) para ser redirecionado.`)
        .setColor(`#36393f`)
    message.channel.send(embed).then(async message => { try { await message.delete({ timeout: 6000 }) } catch (error) { } })

}

exports.help = {
    name: 'formulario',
    description: 'Recebe o formulário de aplicação a equipe;'
}