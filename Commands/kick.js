const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

let infractions = require('../.json/infractions.json');

let kick = async(bot, message, args, user) => {
    const member = message.guild.member(user);
    if(!member) {
        return await message.reply(`Could not find user ${args[0]}`);
    }
    args = args.slice(1);
    let reason = args.join(" ");
    if(reason == "" || reason.length == 0 || args.length == 0) {
        reason = "No reason provided";
    }
    await member.send(`You were kicked from ${message.guild.name} for reason: ${reason}`);
    member.kick(reason)
        .then(() => {
            let kickEmbed = new Discord.MessageEmbed()
                .setTitle(`Kicked ${member.user.username}#${member.user.discriminator}`)
                .addField("Reason", reason)
                .setFooter(`Infraction ID: ${++infractions[message.guild.id][0]}`)
                .setColor("#0033ff")
                .setThumbnail(member.user.avatarURL());
            message.channel.send(kickEmbed);
            infractions[message.guild.id].push(`Kicked ${member.id} for reason: ${reason}`);
            let temp = JSON.stringify(infractions, null, 4);
            fs.writeFileSync(path.join(__dirname, "..", ".json", "infractions.json"), temp);

        }).catch(err => message.reply("There was an error, if this persists, please contact Juptian#2839") && console.log(err));
}

module.exports.run = async(bot, message, args) => {
    if(!message.member.permissions.has('KICK_MEMBERS', true)) {
        return await message.reply("You do not have permissions to kick");
    }
    let userToKick = message.mentions.users.first();
    if(!userToKick) {
        try {
            userToKick = await bot.users.fetch(args[0])
        } catch(err) {
            return message.reply("There was an error fetching the user.");
        }
    }
    kick(bot, message, args, userToKick);
}

module.exports.help = {
    name: "Kick",
    module: "Moderation",
    info: "Kicks a member from the server",
    aliases: "Yeet",
    usage: "kick <user> <reason>"
}