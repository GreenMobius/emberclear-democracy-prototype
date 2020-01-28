const config = require('../config.json');
const Discord = require('discord.js');
const contextManager = require("./context-manager");
const client = new Discord.Client();

class TaskRunnerClass {

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

    reset(guild) {
        console.log('clearing roles from ' + guild.name)
        guild.roles.forEach((role) => {
            role.delete().then(deleted => console.log('deleted role ' + deleted.name))
        })
    }

    setStatus(guild, member, role) {
        this.reset()
        var userContext = contextManager.get_user_context(role.name, member.id)
        if(userContext !== undefined){
            const admin = guild.members.find((member) => member.id === userContext.admin)
            this.changeAdmin(admin, role)
            userContext.members.forEach((member) => {
                let memberObject = guild.members.find((specificMember) => specificMember.id === member)
                this.addUser(memberObject, role)
            })
            return true
        }
        return false    
    }
}

const TaskRunner = new TaskRunnerClass()

module.exports = TaskRunner;