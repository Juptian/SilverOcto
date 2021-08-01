//---------//
// MODULES //
//---------// 
const { channel } = require('diagnostics_channel');
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
bot.commands = new Discord.Collection();


fs.readdir("./Commands/", (err, files) => {
    if(err) console.log(err);

    let commandFiles = files.filter(f => f.substr(f.length - 2) === "js");
    if(commandFiles.length <= 0) {
        console.log("No command files found");
        return;
    }

    // Foreach loop here for simplicity.
    commandFiles.forEach((file, i) => {
        let command = require(`./Commands/${file}`);
        console.log(`${file} loaded!`);
        bot.commands.set(command.help.name, command);
    })
    
    console.log("All command files loaded");
})
let CheckJSONFiles = (guildID) => {
    if(!prefixes[guildID]) {
        console.log("no prefix");
        prefixes[guildID] = [ baseconfig.prefix ];
        let temp = JSON.stringify(prefixes, null, 4);
        fs.writeFileSync('./.json/prefixes.json', temp);
    }

    if(!infractions[guildID]) {
        console.log("no infractions");
        infractions[guildID] = [ ];
        let temp = JSON.stringify(infractions, null, 4);
        fs.writeFileSync('./.json/infractions.json', temp);
    }
}
bot.on("ready", async () => {
    console.log(`${bot.user.username} is online successfully`);
    bot.user.setActivity("you", {type: 'WATCHING'});
})

bot.on("message", async (message) => {
    if(message.author.bot) { return; }
    if(message.channel.type == "dm") { return message.reply("I do not take personal messages, sorry"); }
    await CheckJSONFiles(message.guild.id);
    let guildID = message.guild.id;
    let prefix = prefixes[guildID][1]; 
    if(!message.content.startsWith(prefix)) { return; }

    let splitMessage = message.content.split(" ");
    let command = splitMessage[0].slice(prefix.length);
    let commandToRun = bot.commands.get(command);
    let args = splitMessage.slice(1);
    if(commandToRun) return commandToRun.run(bot, message, args);
    message.reply(`The ${command} command does not exist`);
})

bot.login(token);