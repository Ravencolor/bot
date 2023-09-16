const Discord = require("discord.js")
const loadSlashCommands = require("../Loaders/loadSlashCommands")

module.exports = async bot => {

    await loadSlashCommands(bot)

    console.log(`le bot ${bot.user.tag} est ready !`)
}