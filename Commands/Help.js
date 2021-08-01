const Discord = require('discord.js');
const index = require('../index.js');
const modules = require('../.json/modules.json').modules;
const descriptions = require('../.json/modules.json').descriptions;


let runSelectedModule = async(bot, message, module, args) => {
    let botCommands = index.bot.commands;
    let commandsInModule = Array.from(botCommands.each(cmd => cmd.help.module.toUpperCase() == module.toUpperCase()));
    
    // Due to how the fetching occurs, I do this for loop as to have more clear code later on
    for(let i = 0; i < commandsInModule.length; i++) {
        commandsInModule[i] = commandsInModule[i][1].help;
    }

    let replyEmbed = new Discord.MessageEmbed()
    .setColor("#ff00a2")
    .setTitle(`Commands in module ${module}`)

    for(let i = 0; i < commandsInModule.length; i++) {
        // The aformentioned for loop was to avoid things like
        // commandsInModule[i][1].help.name
        // It makes it look way more cluttered than it needs to be.
        replyEmbed.addField(commandsInModule[i].name, commandsInModule[i].info);
    }
    return message.channel.send(replyEmbed);
}

let runUnselectedModule = async(bot, message, args) => {
    let replyEmbed = new Discord.MessageEmbed()
        .setColor("#ff00a2")
        .setTitle(`Modules list`)

    for(var i = 0; i < modules.length; i++) {
        replyEmbed.addField(modules[i], descriptions[i]);
    }

    return message.channel.send(replyEmbed);
}

module.exports.run = async(bot, message, args) => {
    let moduleSelected = false;
    let chosenModule = null;
    for(var i = 0; i < modules.length; i++) {
        if(args[0].toUpperCase() == modules[i].toUpperCase()) {
            moduleSelected = true;
            chosenModule = modules[i];
            break;
        }
    }
    if(moduleSelected) {
        return runSelectedModule(bot, message, chosenModule, args);
    }
    return runUnselectedModule(bot, message, args);

}

module.exports.help = {
    name: "Help",
    module: "General",
    info: "Command that gives a list of all modules, if targeted at a specific module, it gives a list of all commands in that module",
    aliases: "",
    usage: "help (<module> | <command>)"
}