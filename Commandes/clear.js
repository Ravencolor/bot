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

            let messages = await channel.messages.fetch({ limit: parseInt(number) + 1 });
            messages = messages.filter(msg => msg.deletable);
            await Promise.all(messages.map(msg => msg.delete()));

            await message.followUp({content: `J'ai supprimé \`${messages.size}\` messages !`, ephemeral: true})

        } catch(err) {
            let messages = await channel.messages.fetch();
        
            messages = messages.filter(msg => (Date.now() - msg.createdAt) <= 1209600000);
        
            if (messages.size <= 0) {
                return message.followUp("Je ne peux pas supprimer de message car ils datent de plus de 14 jours !");
            }
        
            try {
                await channel.bulkDelete(messages);
                await message.followUp({content: `J'ai pu supprimer uniquement \`${messages.size}\` messages car les autres dataient de plus de 14 jours !`, ephemeral: true});
            } catch (error) {
                console.error(error);
                return message.followUp("Une erreur s'est produite lors de la suppression des messages.");
            }
        }
        
    }
}
