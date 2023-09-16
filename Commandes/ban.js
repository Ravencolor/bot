const Discord = require("discord.js")

module.exports = {

    name: "ban",
    description: "Ban un membre",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à ban",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison du ban",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        try {
            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à ban !")
            let member = message.guild.members.cache.get(user.id)

            let reason = args.getString("raison")
            if(!reason) reason = "Aucune raison donnée";

            if(message.user.id === user.id) return message.reply("Tu ne peux pas te ban !")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas ban le propriétaire du serveur !")
            if(member && !member.bannable) return message.reply("Je ne peux pas ban ce membre !")// correction jusque ici
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas ban ce membre !")
            if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban !")

            try {await user.send(`Tu es ban de ${message.guild.name} par ${message.author.tag} pour la raison : \`${reason}\``)} catch (err) {}

            await message.reply(`${message.author} a banni ${user.tag} pour la raison : \`${reason}\``)

            await message.guild.bans.create(user.id, { reason: reason })

        } catch (err) {

            return message.reply("Pas de membre à ban !")
        }
    }
}
