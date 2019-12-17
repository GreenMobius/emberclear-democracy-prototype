const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

let TaskRunner = {
    addUser: function(message) {
        let role = message.guild.roles.find(role => role.name === message.channel.name);
        message.member.addRole(role);
    },
    
    removeUser: function(message) {
        let role = message.guild.roles.find(role => role.name === message.channel.name);
        message.member.removeRole(role);
    },
    
    changeAdmin: function(message) {
        // TODO agree on how to represent admin of channel
        const adminRoleString = `${message.channel.name}-admin`;
        const adminRole = message.guild.roles.array.filter(role => role.name === adminRoleString);

        const guild = client.guilds.array.filter(guild => guild.id === config.guildId)[0];
        const currentAdmin = guild.members.array.filter(member => member.roles.array.includes(adminRole))[0];
        currentAdmin.removeRole(adminRole);
        message.member.addRole(adminRole);
    },
}

 module.exports = TaskRunner;