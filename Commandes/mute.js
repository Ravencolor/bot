const Discord = require('discord.js')
const ms = require('ms')

module.exports = {
    name: "mute",
    description: "Mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "temps",
            description: "Le temps du mute",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison du mute",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre à mute !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre à mute !")

        let time = args.getString("temps")
        if(!time) return message.reply("Pas de temps donné !")
        if(isNaN(ms(time))) return message.reply("Temps invalide !")
        if(ms(time) > 2419200000) return message.reply("Temps trop long !")

        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison donnée";

        if(message.user.id === user.id) return message.reply("Tu ne peux pas te mute !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire du serveur !")
        if(!member.moderatable) return message.reply("Je ne peux pas mute ce membre !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas mute ce membre !")
        if(member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute !")

        try {await user.send(`Tu es mute de ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison : \`${reason}\``)} catch (err) {}

        await message.reply(`${message.user} a mute ${user.tag} pendant ${time} pour la raison : \`${reason}\``) // correction jusque ici

        await member.timeout(ms(time), reason)
    }
}