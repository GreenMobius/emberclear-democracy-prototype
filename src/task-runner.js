const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

let TaskRunner = {
    addUser: function(member, role) {
        member.addRole(role);
    },
    
    removeUser: function(member, role) {
        member.removeRole(role);
    },
    
    changeAdmin: function(member, role) {
        // TODO agree on how to represent admin of channel
        //const adminRoleString = `${role.name}_admin`;
        const guild = client.guilds.array.filter(guild => guild.id === config.guildId)[0];
        const currentAdmin = guild.members.array.filter(member => member.roles.array.includes(role))[0];
        if(currentAdmin) {
            currentAdmin.removeRole(adminRole);
        }
        member.addRole(adminRole);
    },
}

 module.exports = TaskRunner;
