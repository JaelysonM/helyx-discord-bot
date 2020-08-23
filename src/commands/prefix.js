const { MessageEmbed } = require('discord.js')


exports.run = async (client, message, args, command) => {
  if (!client.hasPermission(command, message.member))
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });
  if (!client.avaliableUsage(message.guild))
    return message.channel.send(`🚫 O bot nesse servidor não foi completamente configurado.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

  const config = client.configCache.get(message.guild.id);
  if (!args[0]) return message.reply(`🚫 Use: ${config.prefix}prefix <prefixo>.`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })

  await message.channel.send(new MessageEmbed()
    .setThumbnail('https://i.imgur.com/jF1hPnt.png')
    .setAuthor(config.serverName, `${client.user.avatar != null ? client.user.avatar : "https://media3.giphy.com/media/chiLb8yx7ZD1Pdx6CF/giphy.gif"}`)
    .setDescription(`O prefixo dos comandos foi alterado de \`\`${cconfig.prefix}\`\` para \`\`${args[0]}\`\`;`)
    .setFooter(`Prefixo alterado por ${message.author.username}`, message.author.avatarURL).setTimestamp(Date.now())
    .setColor(`#36393f`));

  config.prefix = args[0];
  const configuration = await client.updateGuildValues(message.guild, {
    prefix: args[0],
  });
  client.configCache.set(message.guild.id, configuration);

}
exports.help = {
  name: "prefix",
  roles: ['MASTER'],
  description: 'Altera o prefixo dos comandos do servidor;'
}