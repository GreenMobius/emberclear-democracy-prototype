const config = require("../config.json");
var voteInProgress = false;
var state = null;
const tr = require("./task-runner");
const democracy = require("./democracy");
const contextManager = require("./context-manager");

function messageHandler(message) {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	const channel = message.channel.name;
	const author = message.author;

	if (command === "test") {
		return message.reply("Status: OK");
	}
	
	if (command === "remove-member") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		state = democracy.removeUser(member, channel);
		voteInProgress = true;
		return message.reply("Vote started to remove member " + state.uid);
	}	

	if (command === "add-member") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		state = democracy.addUser(member, channel);
		voteInProgress = true;
		return message.reply("Vote started to add member " + state.uid);
	}

	if (command === "change-admin") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		state = democracy.promoteUser(member, channel);
		voteInProgress = true;
		return message.reply("Vote started to promote member " + state.uid);
	}

	if (command === "vote") {
		if(!voteInProgress) {
			return message.reply("There are no votes in progress.");
		}
		// invoke democracy vote
		var response = args.shift().toLowerCase();
		var vote;
		switch(response) {
			case "yes":
			case "yea":
			case "y":
			case "aye":
			case "ay":
				vote = true;
				break;
			case "no":
			case "nay":
			case "n":
			case "nah":
				vote = false;
				break;
		}
		let voteStatus = democracy.vote(message.author, null, vote);
		// if pass, execute command
		if(voteStatus.yea.length > voteStatus.nay.length + voteStatus.remain.length) {
            switch(voteStatus.action) {
            	case "add":
            		tr.addUser(message, voteStatus.uid);
            		return message.reply("Vote has passed, adding user " + voteStatus.uid);
            	case "remove":
            		tr.removeUser(message, voteStatus.uid);
            		return message.reply("Vote has passed, removing user " + voteStatus.uid);
        		case "promote":
            		tr.changeAdmin(message, voteStatus.uid);
            		return message.reply("Vote has passed, promoting user " + voteStatus.uid);
            	default:
            		return message.reply("Vote has passed, but there was no action?");
            }
            voteInProgress = false;
        }
		// if fail, announce fail
		if(voteStatus.nay.length > voteStatus.yea.length + voteStatus.remain.length) {
            return message.reply("Vote has failed. Nothing changes.");
            voteInProgress = false;
        }

        return message.reply("Vote counted. There are now " + state.yea.length + " votes for, and " + state.nay.length + " votes against. " + state.remain.length + " votes remain.");
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
