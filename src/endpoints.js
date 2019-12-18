const config = require("../config.json");
const Democracy = require("./democracy.js");
var voteInProgress = false;

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	let channel = message.channel;

	// TODO: remove after democracy commands are implemented
	if (command === "test") {
		return message.reply("Status: OK");
	}
	
	if (command === "remove-member") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		voteInProgress = true;
		return message.reply(Democracy.removeUser(member, channel));
	}	

	if (command === "add-member") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		voteInProgress = true;
		return message.reply(Democracy.addUser(member, channel));
	}

	if (command === "change-admin") {
		if(!member)
	  		return message.reply("Please mention a valid member of this server");
		if(voteInProgress) {
			return message.reply("Error: A vote is already in progress.");
		}
		voteInProgress = true;
		return message.reply(Democracy.changeAdmin(member, channel));
	}

	if (command === "vote") {
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
		return message.reply(Democracy.vote(message.author, null, vote));
		// if pass, execute command
		// if fail, announce fail
	}
}

module.exports.handleMessage = messageHandler;