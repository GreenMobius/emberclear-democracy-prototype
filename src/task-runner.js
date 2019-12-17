let TaskRunner = {
    addUser: function (message) {
        let role = message.guild.roles.find(role => role.name === message.channel);
        message.member.addRole(role);
    },
    
    removeUser: function (message) {
        let role = message.guild.roles.find(role => role.name === message.channel);
        message.member.removeRole(role);
    },
    
    promoteUser: function (message) {
        // TODO agree on how to represent admin of channel
        let role = message.guild.roles.find(role => role.name === `${message.channel}-admin`);
        message.member.addRole(role);
    },
}

 module.exports = TaskRunner;