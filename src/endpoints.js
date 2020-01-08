const config = require("../config.json");
const tr = require("./task-runner");
const democracy = require("./democracy");
const contextManager = require("./context-manager.js");

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const uid = message.user.id;
	const channel = message.channel.name;
	const author = message.author;

	if (command === "test") {
		return message.reply("Status: OK");
	}
	
	if (command === "remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if (!member) {
			return message.reply("Please mention a valid member of this server");
		}
		
		let votePassed = democracy.removeUser(uid, channel);

		if (votePassed) {
			tr.removeUser(message, member);
		}
	}	

	if (command === "add-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if (!member) {
			return message.reply("Please mention a valid member of this server");
		}
		let votePassed = democracy.addUser(uid, channel);

		if (votePassed) {
			tr.addUser(message, member);
		}
	}

	if (command === "change-admin") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if (!member) {
			return message.reply("Please mention a valid member of this server");
		}
		let votePassed = democracy.promoteUser(uid, channel);

		if (votePassed) {
			tr.changeAdmin(message, member);
		}
	}

	if (command === "change-user-context-admin") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return console.log("The role does not exist")
		}
		let currentUserContext = contextManager.get_users_user_context(role.name, author.id)
		currentUserContext.admin = member.id
		contextManager.change_users_user_context(role.name, author.id, currentUserContext)
	}

	if (command === "change-user-context-add-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return console.log("The role does not exist")
		}
		let currentUserContext = contextManager.get_users_user_context(role.name, author.id)
		if(currentUserContext.members.find(member.id) === undefined){
			currentUserContext.members.push(member.id)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
		}		
	}

	if (command === "change-user-context-remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return console.log("The role does not exist")
		}
		let currentUserContext = contextManager.get_users_user_context(role.name, author.id)
		if(currentUserContext.members.find(member.id) !== undefined){
			var index = currentUserContext.members.findIndex(member.id)
			currentUserContext.members.splice(index, 1)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
		}
	}
}

module.exports.handleMessage = messageHandler;