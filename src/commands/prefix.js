const { MessageEmbed } = require('discord.js')


exports.run = async (client, message, args, command) => {

  message.delete();
  if (client.getMemberCommands(message.member).find(cmd => cmd.help.name == command.help.name) == undefined)
    return message.channel.send(`🚫 Você não possui permissão para executar este comando.`).then(async message => { try { await message.delete({ timeout: 2000 }) } catch (error) { } });

  const config = client.configCache.get(message.guild.id);
  if (!args[0]) return message.reply(`🚫 Use: ${config.prefix}prefix <prefixo>.`).then(async message => { try { await message.delete({ timeout: 5000 }) } catch (error) { } })

  await message.channel.send(new MessageEmbed()
    .setThumbnail('https://i.imgur.com/jF1hPnt.png')
    .setAuthor(`Rede Helyx`, `https://media.discordapp.net/attachments/730290989771784262/730291287516905522/logo-helyx-50x50.png`)
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
  roles: ['GERENTE'],
  description: 'Altera o prefixo dos comandos do servidor;'
}