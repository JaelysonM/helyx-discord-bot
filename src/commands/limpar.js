const Discord = require("discord.js");

exports.run = (client, message, args, command) => {
    if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    if (!args[0]) return message.reply("🚫 Use: /limpar <quantidade>.")
    message.channel.bulkDelete(args[0]).then(() => {
    });
}

exports.help = {
    name: "limpar",
    roles: ['AJUDANTE'],
    description: 'Limpa a histórico de mensagens de um canal com um certo alcançe;'
}