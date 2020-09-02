const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', async (message) => {
	if (!message.author.bot) { // The message is not sent by a bot

		let content = message.content;	// The conents of the message
		if (content == "!ping")
	}
})

client.login(token);
