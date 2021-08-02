const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const ms = require('ms');

const OneSecond = 1000;
const OneMinute = 60 * OneSecond;
const OneHour = 60 * OneMinute;
const OneDay = 24 * OneHour;
const OneWeek = 7 * OneDay;
const OneMonth = 4 * OneWeek;
const OneYear = 365 * OneDay;

let infractions = require('../.json/infractions.json');

let kick = async(bot, message, args, user) => {
    const member = message.guild.member(user);
    if(!member) {
        return await message.reply(`Could not find user ${args[0]}`);
    }
    let time = args[1];
    args = args.slice(2);
    let reason = args.join(" ");
    if(reason == "" || reason.length == 0 || args.length == 1) {
        reason = "No reason provided";
    }
    await member.send(`You were banned from ${message.guild.name} for ${time} with reason of: ${reason}`);
    member.ban(null, 2, reason)
        .then(() => {
            let kickEmbed = new Discord.MessageEmbed()
                .setTitle(`Banned ${member.user.username}#${member.user.discriminator}`)
                .addField("Reason", reason)
                .setFooter(`Infraction ID: ${++infractions[message.guild.id][0]}`)
                .setColor("#0033ff")
                .setThumbnail(member.user.avatarURL());
            message.channel.send(kickEmbed);
            infractions[message.guild.id].push([`Banned ${member.id} for ${time} reason: ${reason}`, time]);
            let temp = JSON.stringify(infractions, null, 4);
            fs.writeFileSync(path.join(__dirname, "..", ".json", "infractions.json"), temp);

        }).then(() => {
            
        }).catch(err => message.reply("There was an error, if this persists, please contact Juptian#2839") && console.log(err));
}

module.exports.run = async(bot, message, args) => {
    if(!message.member.permissions.has('BAN_MEMBERS', true)) {
        return await message.reply("You do not have permissions to ban");
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
    name: "Ban",
    module: "Moderation",
    info: "Bans a member from the server",
    aliases: "Begone",
    usage: "Ban <user> <time> <reason>"
}