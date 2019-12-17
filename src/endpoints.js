const config = require("../config.json");
const contextManager = require("./context-manager.js");

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const author = message.author;

	// TODO: remove after democracy commands are implemented
	if (command === "test") {
		return message.reply("Status: OK");
	}
	
	if (command === "remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if(!member)
		  return message.reply("Please mention a valid member of this server");
			// TODO: call democracy function
	}	

	if (command === "add-member") {
		// TODO: call democracy function
	}

	if (command === "change-admin") {
		// TODO: call democracy function
	}

	if (command === "change-user-context-admin") {
		let member = message.mentions.members.first()
		let currentUserContext = contextManager.get_users_user_context(message.guild.id, author.id)
		currentUserContext.admin = member.id
		contextManager.change_users_user_context(message.guild.id, author.id, currentUserContext)
	}

	if (command === "change-user-context-add-member") {
		let member = message.mentions.members.first()
		let currentUserContext = contextManager.get_users_user_context(message.guild.id, author.id)
		if(currentUserContext.members.find(member.id) === undefined){
			currentUserContext.members.push(member.id)
			contextManager.change_users_user_context(message.guild.id, author.id, currentUserContext)
		}		
	}

	if (command === "change-user-context-remove-member") {
		let member = message.mentions.members.first()
		let currentUserContext = contextManager.get_users_user_context(message.guild.id, author.id)
		if(currentUserContext.members.find(member.id) !== undefined){
			var index = currentUserContext.members.findIndex(member.id)
			currentUserContext.members.splice(index, 1)
			contextManager.change_users_user_context(message.guild.id, author.id, currentUserContext)
		}
	}
}

module.exports.handleMessage = messageHandler;