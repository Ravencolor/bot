const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Renvoie le ping du bot",
    permission: "aucune",
    dm: true,
    category: "Informations",

    async run(bot, message, args) {

        await message.reply(`Ping : \`${bot.ws.ping}\``)
    }
}