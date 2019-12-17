const config = require("../config.json");

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// TODO: remove after democracy commands are implemented
	if (command === "test") {
		return message.reply("Status: OK");
	}

	let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!member)
	  return message.reply("Please mention a valid member of this server");
	let channel = message.channel;
	
	if (command === "remove-member") {
		return message.reply(Democracy.removeUser(member, channel));
	}	

	if (command === "add-member") {
		return message.reply(Democracy.add(member, channel));
	}

	if (command === "change-admin") {
		return message.reply(Democracy.changeAdmin(member, channel));
	}

	if (command === "vote") {
		// invoke democracy vote
		// if pass, execute command
		// if fail, announce fail
	}
}

module.exports.handleMessage = messageHandler;