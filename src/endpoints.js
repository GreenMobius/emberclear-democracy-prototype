const config = require("../config.json");
const tr = require("./task-runner");
const democracy = require("./democracy");
const contextManager = require("./context-manager.js");

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	//const uid = message.user.id;
	const channel = message.channel.name;
	const author = message.author;

	if (command === "test") {
		return message.reply("Status: OK");
	}

	if (command === "create-channel") {
		contextManager.add_channel(args[0], author.id)
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
	    	return message.reply("The role does not exist")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		currentUserContext.admin = member.id
		contextManager.change_users_user_context(role.name, author.id, currentUserContext)
		return message.reply("Successfully changed admin to " + member.id)
	}

	if (command === "change-user-context-add-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return message.reply("The role does not exist")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		if(currentUserContext.members.find((contextMember) => contextMember === member.id) === undefined){
			currentUserContext.members.push(member.id)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
			return message.reply("Successfully added user " + member.id)
		}		
	}

	if (command === "change-user-context-remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return message.reply("The role does not exist")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		if(currentUserContext.members.find((contextMember) => contextMember === member.id) !== undefined){
			var index = currentUserContext.members.findIndex((contextMember) => contextMember === member.id)
			currentUserContext.members.splice(index, 1)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
			return message.reply("Successfully removed user " + member.id)
		}
	}

	if (command === "view-user-context") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
	    	return message.reply("The role does not exist")
		}
		return message.reply(JSON.stringify(contextManager.get_user_context(role.name, author.id), null, 2))
	}
}

module.exports.handleMessage = messageHandler;