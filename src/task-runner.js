const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

let TaskRunner = {
    addUser: function(message, member) {
        let role = message.guild.roles.find(role => role.name === message.channel.name);
        member.addRole(role);
    },
    
    removeUser: function(message, member) {
        let role = message.guild.roles.find(role => role.name === message.channel.name);
        member.removeRole(role);
    },
    
    changeAdmin: function(message, member) {
        // TODO agree on how to represent admin of channel
        const adminRoleString = `${message.channel.name}-admin`;
        const adminRole = message.guild.roles.array.filter(role => role.name === adminRoleString);

        const guild = client.guilds.array.filter(guild => guild.id === config.guildId)[0];
        const currentAdmin = guild.members.array.filter(member => member.roles.array.includes(adminRole))[0];
        currentAdmin.removeRole(adminRole);
        member.addRole(adminRole);
    },
}

 module.exports = TaskRunner;