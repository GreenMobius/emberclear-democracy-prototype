const config = require("../config.json");
const tr = require("./task-runner");
const democracy = require("./democracy");
const contextManager = require("./context-manager");

var voteInProgress = false;
var state = null;

function messageHandler(message) {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	const channel = message.channel.name
	const author = message.author

	if (command === "test") {
		return message.reply("Status: OK")
	}

	else if (command === "state") {
		return message.reply(JSON.stringify(state, null, 2))
	}

	else if (command === "create-channel") {
		let role = message.guild.roles.find(role => role.name === args[0])
		contextManager.add_channel(role.name, author.id)
		tr.addUser(author, role)
		tr.changeAdmin(author, role)
		return message.reply("Created channel " + arg[0])
	}

	else if (command === "add-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		let channel = {
			"chid": role.name,
			"members": contextManager.get_user_context(role.name, author.id).members,
			"admin": contextManager.get_user_context(role.name, author.id).admin
		}
		if (!member) {
			return message.reply("Please mention a valid member of this server")
		}
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.")
		}

		state = democracy.addUser(author, member, channel)
		voteInProgress = true
		return message.reply("Vote started to add member " + member.id)
	}

	else if (command === "remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		let channel = {
			"chid": role.name,
			"members": contextManager.get_user_context(role.name, author.id).members,
			"admin": contextManager.get_user_context(role.name, author.id).admin
		}
		if (!member) {
			return message.reply("Please mention a valid member of this server")
		}
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.")
		}

		state = democracy.removeUser(author, member, channel)
		voteInProgress = true
		return message.reply("Vote started to remove member " + member.id)
	}

	else if (command === "change-admin") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		let channel = {
			"chid": role.name,
			"members": contextManager.get_user_context(role.name, author.id).members,
			"admin": contextManager.get_user_context(role.name, author.id).admin
		}
		if(!member) {
			return message.reply("Please mention a valid member of this server")
		}
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.")
		}

		state = democracy.promoteUser(author, member, channel)
		voteInProgress = true
		return message.reply("Vote started to promote member" + member.id)
	}

	else if (command === "vote") {
		if(!voteInProgress) {
			return message.reply("There are no votes in progress.")
		}
		let role = message.guild.roles.find(role => role.name === state.channel.chid)
		let channel = {
			"chid": role.name,
			"members": contextManager.get_user_context(role.name, author.id).members,
			"admin": contextManager.get_user_context(role.name, author.id).admin
		}

		// invoke democracy vote
		var response = args[0]
		var vote;
		switch(response) {
			case "yes":
			case "yea":
			case "y":
			case "aye":
			case "ay":
			case "no'nt":
			case "Yes":
			case "Yea":
			case "Y":
			case "Aye":
			case "Ay":
			case "No'nt":
				vote = true
				break
			case "no":
			case "nay":
			case "n":
			case "nah":
			case "yesn't":
			case "No":
			case "Nay":
			case "N":
			case "Nah":
			case "Yesn't":
			default:
				vote = false
				break
		}

		state = democracy.vote(message.author, state, vote)

		if(state.error) {
			return message.reply("Error during voting: " + state.error)
		}

		message.reply("Vote counted. There are now " + state.yea.length + " votes for, and " + state.nay.length + " votes against. " + state.remain.length + " votes remain.")

		// if pass, execute command
		if(state.yea.length > state.nay.length + state.remain.length) {
			voteInProgress = false
			switch(state.action) {
				case "add":
					contextManager.add_user(channel.chid, state.target.id, author.id)
					tr.addUser(state.target, role)
					return message.reply("Vote has passed, adding user " + state.target)
				case "remove":
					contextManager.delete_user(channel.chid, state.target.id, author.id)
					tr.removeUser(state.target, role)
					return message.reply("Vote has passed, removing user " + state.target)
				case "promote":
					contextManager.change_admin(channel.chid, state.target.id, author.id)
					tr.changeAdmin(state.target, role)
					return message.reply("Vote has passed, promoting user " + state.target)
				default:
					return message.reply("Vote has passed, but there was no action?")
			}
		}
		// if fail, announce fail
		if(state.nay.length > state.yea.length + state.remain.length) {
			voteInProgress = false
			return message.reply("Vote has failed. Nothing changes.")
		}
	}

	else if (command === "change-user-context-admin") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
			return message.reply("The role does not exist or no role was provided")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		currentUserContext.admin = member.id
		contextManager.change_users_user_context(role.name, author.id, currentUserContext)
		return message.reply("Successfully changed admin to " + member.id)
	}

	else if (command === "change-user-context-add-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
			return message.reply("The role does not exist or no role was provided")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		if(currentUserContext.members.find((contextMember) => contextMember === member.id) === undefined) {
			currentUserContext.members.push(member.id)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
			return message.reply("Successfully added user " + member.id)
		}		
	}

	else if (command === "change-user-context-remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
			return message.reply("The role does not exist or no role was provided")
		}
		let currentUserContext = contextManager.get_user_context(role.name, author.id)
		if(currentUserContext.members.find((contextMember) => contextMember === member.id) !== undefined){
			var index = currentUserContext.members.findIndex((contextMember) => contextMember === member.id)
			currentUserContext.members.splice(index, 1)
			contextManager.change_users_user_context(role.name, author.id, currentUserContext)
			return message.reply("Successfully removed user " + member.id)
		}
	}

	else if (command === "view-user-context") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0])
		let role = message.guild.roles.find(role => role.name === args[1])
		if (!role) {
			return message.reply("The role does not exist or no role was provided")
		}
		let currentUserContext = contextManager.get_user_context(role.name, member.id)
		if(!currentUserContext) {
			return message.reply("There is currently no context for that user and role")
		}
		return message.reply(JSON.stringify(currentUserContext, null, 2))
	}
	
	else if (command === "cancel-vote") {
		state = null;
		voteInProgress = false;
	}

	else if (command === "reset") {
		contextManager.save_all_contexts([])
	}
	
	else {
		return message.reply("Available commands: \n\
		test \n\
		state \n\
		create-channel [role]\n\
		add-member [user] [role]\n\
		remove-member [user] [role]\n\
		change-admin [user] [role]\n\
		vote [yes/no]\n\
		create-channel [role]\n\
		change-user-context-admin [user] [role]\n\
		change-user-context-add-member [user] [role]\n\
		change-user-context-remove-member [user] [role]\n\
		view-user-context [user] [role]\n\
		cancel-vote\n\
		reset\n"
		)
	}
}

module.exports.handleMessage = messageHandler;
