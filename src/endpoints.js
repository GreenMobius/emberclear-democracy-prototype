const config = require("../config.json");
const tr = require("./task-runner");
const democracy = require("./democracy");

function messageHandler(message){
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const uid = message.user.id;
	const channel = message.channel.name;

	if (command === "test") {
		return message.reply("Status: OK");
	}
	
	if (command === "remove-member") {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if(!member) {
			return message.reply("Please mention a valid member of this server");
		}
		
		let votePassed = democracy.removeUser(uid, channel);

		if (votePassed) {
			tr.removeUser(message);
		}
	}	

	if (command === "add-member") {
		let votePassed = democracy.addUser(uid, channel);

		if (votePassed) {
			tr.addUser(message);
		}
	}

	if (command === "change-admin") {
		let votePassed = democracy.promoteUser(uid, channel);

		if (votePassed) {
			tr.changeAdmin(message);
		}
	}
}

module.exports.handleMessage = messageHandler;