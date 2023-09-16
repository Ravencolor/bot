const Discord = require("discord.js");

module.exports = {

    name: "clear",
    description: "Clear des messages",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre de message à effacer",
            required: true,
            autocomplete: false
        }, {
            type: "channel",
            name: "salon",
            description: "Le salon où effacer les message",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon !")

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Le nombre doit être compris entre 1 et 100 !")

        await message.deferReply()
        try {

            let messages = await channel.bulkDelete(parseInt(number))

            await message.followUp({content: `J'ai supprimé \`${messages.size}\` messages !`, ephemeral: true})

        } catch(err) {

            let messages = [...(await channel.messages.fetch()).filter(async msg => (Date.now() - msg.createdAt) <= 1209600000).values()]
            if(messages.length <= 0) return message.followUp("Je ne peux pas supprimer de message car ils datent de plus de 14 jours !")
            await channel.bulkDelete(messages)

            await message.followUp({content: `J'ai pu supprimer uniquement \`${messages.length}\` messages car les autres dataient de plus de 14 jours !`, ephemeral: true})
        }
    }
}
