const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require("../auth.json");

client.on('message', async (message) => {
	if (!message.author.bot) { // The message is not sent by a bot

		let content = message.content;	// The conents of the message
		if (content == "!ping") {
			message.channel.send("!pong") // Send `!pong` in the channel where `!ping was sent`
		}
	}
})

client.login(token);
