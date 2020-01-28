const config = require('../config.json');
const Discord = require('discord.js');
const contextManager = require("./context-manager");
const client = new Discord.Client();

class TaskRunnerClass {

    createChannel(guild, roleName) {
        return guild.createRole({
            name: roleName
        })
    }

    addUser(member, role) {
        member.addRole(role.id);
    }
    
    removeUser(member, role) {
        member.removeRole(role);
    }
    
    changeAdmin(guild, member, role) {
        const currentAdmin = guild.members.filter(member => member.roles.includes(role))[0];
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
        this.reset(guild)
        this.createChannel(guild, role.name).then(() => {
            var userContext = contextManager.get_user_context(role.name, member.id)
            if(userContext !== undefined){
                const admin = guild.members.find((member) => member.id === userContext.admin)
                this.changeAdmin(guild, admin, role)
                userContext.members.forEach((member) => {
                    let memberObject = guild.members.find((specificMember) => specificMember.id === member)
                    this.addUser(memberObject, role)
                })
                return true
            }
            return false
        })            
    }
}

const TaskRunner = new TaskRunnerClass()

module.exports = TaskRunner;