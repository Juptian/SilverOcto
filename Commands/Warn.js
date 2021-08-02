const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

let infractions = require('../.json/infractions.json');

let warn = async(bot, message, args, user) => {
    const member = message.guild.member(user);
    if(!member) {
        return message.reply(`Could not find user ${args[0]}`);
    }
    console.log(member);

    args = args.slice(1);
    let reason = args.join(" ");
    if(reason == "" || reason.length == 0 || args.length == 0) {
        reason = "No reason provided";
    }
    await member.send(`You've been warned in ${message.guild.name} for reason: ${reason}`);
    let warnEmbed = new Discord.MessageEmbed()
        .setTitle(`Kicked ${member.user.username}#${member.user.discriminator}`)
        .addField("Reason", reason)
        .setFooter(`Infraction ID: ${++infractions[message.guild.id][0]}`)
        .setColor("#0033ff")
        .setThumbnail(member.user.avatarURL());
    message.channel.send(warnEmbed);
    infractions[message.guild.id].push(`Warned ${member.id} for reason: ${reason}`);
    let temp = JSON.stringify(infractions, null, 4);
    fs.writeFileSync(path.join(__dirname, "..", ".json", "infractions.json"), temp);
}

module.exports.run = async(bot, message, args) => {
    if(!message.member.permissions.has('KICK_MEMBERS', true)) {
        return await message.reply("You do not have permissions to kick");
    }
    let userToWarn = message.mentions.users.first();
    if(!userToWarn) {
        try {
            userToWarn = await bot.users.fetch(args[0])
        } catch(err) {
            return message.reply("There was an error fetching the user.");
        }
    }
    warn(bot, message, args, userToWarn);
}

module.exports.help = {
    name: "Warn",
    module: "Moderation",
    info: "Warns a user",
    aliases: "",
    usage: "warn <user> <reason>"
}