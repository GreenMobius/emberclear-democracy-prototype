const Discord = require("discord.js");
const endpoints = require("./endpoints.js");
const client = new Discord.Client();
const config = require("../config.json");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
    endpoints.handleMessage(message);
});

client.login(config.token);