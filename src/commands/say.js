const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, command) => {

     if (!client.hasPermission(command, message.member))
        return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

    if(!args[0]) return message.channel.send(new MessageEmbed().setDescription(`<@${message.author.id}>, Por favor insira alguma mensagem.`)
    .setColor(`36393f`))
    const sayMessage = args.join(" ");

    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);

}

exports.help = {
    name: 'say',
    aliases: ['send'],
    roles: ['GERENTE']
}