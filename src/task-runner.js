let TaskRunner = {
    addUser: function (message, channel) {
        let role = message.guild.roles.find(role => role.name === channel);
        message.member.addRole(role);
    },
    
    removeUser: function (message, channel) {
        let role = message.guild.roles.find(role => role.name === channel);
        message.member.removeRole(role);
    },
    
    promoteUser: function (message, channel) {
        // TODO agree on how to represent admin of channel
        let role = message.guild.roles.find(role => role.name === "${channel}-admin");
        message.member.addRole(role);
    },
}

export default TaskRunner;