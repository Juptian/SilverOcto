//---------//
// MODULES //
//---------// 
const Discord = require('discord.js');
const fs = require('fs');

//---------//
//  FILES  //
//---------//
const baseconfig = require('./.config/config.json');
let infractions = require('./.json/infractions.json');
let prefixes = require('./.json/prefixes.json');

//---------//
//  OTHER  //
//---------//
const bot = new Discord.Client({disableEveryone: true});
const token = baseconfig.TOKEN;
const jsonPath = './.json/';
const configPath = './.config/';
const commandPath = './Commands/';

bot.commands = new Discord.Collection();

let loadAliases = async(file, command) => {
    let aliases = command.help.aliases.split(", ");
    for(let i = 0; i < aliases.length; i++) {
        await bot.commands.set(aliases[i].toUpperCase(), command);
        console.log(`${file} loaded with alias '${aliases[i]}'!`);
    }
}
fs.readdir(commandPath, (err, files) => {
    if(err) console.log(err);

    let commandFiles = files.filter(f => f.substr(f.length - 2) === "js");
    if(commandFiles.length <= 0) {
        console.log("No command files found");
        return;
    }

    // Foreach loop here for simplicity.
    commandFiles.forEach((file, i) => {
        let command = require(`${commandPath}${file}`);
        bot.commands.set(command.help.name.toUpperCase(), command);

        if(command.help.aliases != "") {
            loadAliases(file, command);
        } else {
            console.log(`${file} loaded!`);
        }
    })
    
})

let CheckJSONFiles = (guildID) => {
    if(!prefixes[guildID]) {
        prefixes[guildID] = [ baseconfig.prefix ];
        let temp = JSON.stringify(prefixes, null, 4);
        fs.writeFileSync(`${jsonPath}prefixes.json`, temp);
    }

    if(!infractions[guildID]) {
        infractions[guildID] = [ 0 ];
        let temp = JSON.stringify(infractions, null, 4);
        fs.writeFileSync(`${jsonPath}infractions.json`, temp);
    }
}

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online successfully`);
    bot.user.setActivity("you", {type: 'WATCHING'});
})

bot.on("message", async (message) => {
    if(message.author.bot) { return; }
    if(message.channel.type == "dm") { return message.reply("I do not take personal messages, sorry"); }
    
    let guildID = message.guild.id;
    await CheckJSONFiles(guildID);

    let prefix = prefixes[guildID][0]; 
    if(!message.content.startsWith(prefix)) { return; }

    let splitMessage = message.content.split(" ");
    let command = splitMessage[0].slice(prefix.length);
    let commandToRun = bot.commands.get(command.toUpperCase());
    let args = splitMessage.slice(1);
    if(commandToRun) return commandToRun.run(bot, message, args);
    message.reply(`The ${command} command does not exist`);
})

bot.login(token);

module.exports = { bot, commandPath, jsonPath, configPath };