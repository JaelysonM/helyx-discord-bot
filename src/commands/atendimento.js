const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, command) => {
    message.delete();
    const config = client.configCache.get(message.guild.id);
    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    const embed = new MessageEmbed()
        .setTitle(`Área de atendimento ao jogador.`)
        .setDescription(`Clique em um emoji abaixo para ser redirecionado a\n criação de seu ticket, o atendimento será realizado por meio de suas mensagens privadas.\n\nAgora estamos com **${parseFloat((Object.values(client.tickets).length / config.ticketsCapacity) * 100).toFixed(2)}%** da central em uso.`)
        .setImage('https://minecraftskinstealer.com/achievement/19/Converse+conosco%21/Clique+no+emoji+abaixo.')
        .setColor(`#36393f`)

    message.channel.send(embed).then(async msg => {
        await msg.react(`❓`)

    })
}
exports.help = {
    name: "marcella",
    roles: ['MASTER'],
    description: 'Cria a mensagem do atendimento dos tickets do servidor;'
}