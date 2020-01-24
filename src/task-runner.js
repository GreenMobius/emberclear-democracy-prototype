const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

class TaskRunnerClass {

    createChannel(guild, channelName, member) {
        guild.createRole({
            name: channelName
        }).then(() => {
            let role = guild.roles.find(role => role.name === channelName)
            this.addUser(member, role)
            this.changeAdmin(member, role)
        })        
    }

    addUser(member, role) {
        member.addRole(role.id);
    }
    
    removeUser(member, role) {
        member.removeRole(role);
    }
    
    changeAdmin(member, role) {
        // TODO agree on how to represent admin of channel
        //const adminRoleString = `${role.name}_admin`;
        const guild = client.guilds.filter(guild => guild.id === config.guildId)[0];
        const currentAdmin = guild.members.filter(member => member.roles.array.includes(role))[0];
        if(currentAdmin) {
            currentAdmin.removeRole(adminRole);
        }
        member.addRole(adminRole);
    }

    reset() {
        client.guilds.forEach((guild) => guild.roles = [])
    }

    setStatus(userContext, role) {
        this.reset()
        const guild = client.guilds.filter(guild => guild.id === config.guildId)[0]
        const admin = guild.members.find((member) => member.id === userContext.admin)
        this.changeAdmin(admin, role)
        userContext.members.forEach((member) => {
            let memberObject = guild.members.find((specificMember) => specificMember.id === member)
            this.addUser(memberObject, role)
        })
    }
}

const TaskRunner = new TaskRunnerClass()

module.exports = TaskRunner;