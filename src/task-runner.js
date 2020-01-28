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
        return member.addRole(role.id);
    }
    
    removeUser(member, role) {
        return member.removeRole(role);
    }
    
    changeAdmin(guild, member, role) {
        const currentAdmin = guild.members.filter(member => member.roles.includes(role))[0];
        var promises = []
        if(currentAdmin) {
            promises.push(currentAdmin.removeRole(adminRole))
        }
        promises.push(member.addRole(adminRole))
        return Promise.allSettled(promises)
    }

    reset(guild) {
        console.log('clearing roles from ' + guild.name)
        var promises = []
        guild.roles.forEach((role) => {
            promises.push(role.delete().then(deleted => console.log('deleted role ' + deleted.name)))
        })
        return Promise.allSettled(promises)
    }

    setStatus(guild, member, role) {
        this.reset(guild).then(() => {
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
        })
    }
}

const TaskRunner = new TaskRunnerClass()

module.exports = TaskRunner;