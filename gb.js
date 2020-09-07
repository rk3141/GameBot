const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const {email,passc} = require("../auth.json")
const nodemailer = require("nodemailer")
let spamblock = [];

// Lottery
var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 2525,
  auth: {
    user: email,
    pass: passc
  }
});

function send_mail(to,sub,text) {
    var mailOptions = {
      from: `"Rishit" <${email}>`,
      to: '${to}',
      subject: sub,
      text: text
    };
    
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

function rand_num(to) {
	return Math.floor( Math.random() * to)
}

function sell_back(kaun,kya,kitna) {
	let inventory = JSON.parse(
		fs.readFileSync('lib/dcoin.dat.json').toString()
	)

	let l = 0;
	let j = "";
	for (let p in inventory) {
		if (inventory[p]["auth"] == kaun) {
			j = p
			break;
		}
		l++
	}
	if (l == 3) {
		return -1;
	}

	let flag = 0;
	inventory[j]["inventory"].map(
		(x) => {
			if (x == kya) {
				flag++;
			}
		}
	)
	if (flag == 0) {
		return 1;
	} else {
		let newinv = []
		let mappy = 0;
		let retmt = 0
		inventory[j]["inventory"].map(
			(x) => {
				if (mappy != kitna && x == kya) {
					retmt += JSON.parse(fs.readFileSync("lib/shop.json").toString())[kya]
					mappy++;
				} else {
					newinv.push(x)
				}
			}
		)
		inventory[j]["inventory"] = newinv
		inventory[j]["amt"] += retmt
		save(inventory)
	}
}

function submit_lottery(me,what) {
	let locks = fs.readFileSync('bin.tmp').toString();
	const Lottery = fs.readFileSync('lib/lottery._').toString()
	if (!locks.includes(me)) {
		if (what == Lottery) {
			return 100;
		} else {
			fs.appendFileSync('bin.tmp',`${me}-${what}`)
			return 0;
		}
	} else {
		return -1;
	}
}

function lc(l,w) {
	var r = 0;
	for (i in l) {
		console.log(r,i,w)
		if (l[i] == w) {
			r = r+1
		}
	}
	return r
}

function shop() {
	const shop = JSON.parse(fs.readFileSync('lib/shop.json').toString())
	let re = ''
	for (let x in shop) {
		re += `${x} is available for ${shop[x]} **DCoins**\n`
	}
	return re
}

function myInventory(by) {
	let bank = JSON.parse(fs.readFileSync('lib/dcoin.dat.json').toString())

	let users = []
	for (let user in bank) {
		users.push(bank[user]['username'])
	}
	let f = '';

	for (let b in bank) {
		if (by == bank[b]['username']){
			f = b
		}
	}
	if (f == '') {
		return -13
	}

	let flag = 0
	for (let user of users) {
		if (user == by)
			flag++;
	}
	if (flag == 1) {
		// console.log(auth,bank[f]['auth'],amt < bank[f]["amt"])
		let r = []
		let inventory = bank[f]['inventory']
		let c = {}
		let final = []
		console.log(inventory)
		for(let i = 0; i < inventory.length; i++) {
			c[inventory[i]] = lc(inventory,inventory[i])
		}
		for (let m in c) {
			final.push(`${c[m]}x ${m}`)
			console.log(m,c)
		}
		if (final.join(', ') == '') {
			return 1
		} else {
			return final.join(', ')
		}
	}
	return -11
}

function buy(what,by,auth) {
	const shop = JSON.parse(fs.readFileSync('lib/shop.json').toString())
	let bank = JSON.parse(fs.readFileSync('lib/dcoin.dat.json').toString())

	let amt = shop[what]
	if (!amt) {
		return -15
	}

	console.log("Found!")
	let users = []
	for (let user in bank) {
		users.push(bank[user]['username'])
	}
	let f = '';

	for (let b in bank) {
		if (by == bank[b]['username']){
			f = b
		}
	}
	if (f == '') {
		return -13
	}

	let flag = 0
	for (let user of users) {
		if (user == by)
			flag++;
	}
	if (flag == 1) {
		// console.log(auth,bank[f]['auth'],amt < bank[f]["amt"])
		
		if (bank[f]["amt"] < amt) {
			return -1
		}

		if (auth != bank[f]['auth']) {
			return -10;
		}
		let a = Number(amt)
		bank[f]["amt"] -= a
		bank[f]['inventory'].push(what)
		save(bank)
		return 0;
	}
	return -11
}
//

//

	function isAmeAs(x,y) {
		if (x.length != y.length) {
			console.log(x.length,y.length)
			return false
		}
		for (let i = 0; i < x.length ; i++) {
			if (x[i] != y[i]) {
				console.log(x[i],y[i])
				return false
			}
		}
		return true
	}

	function whatmoney(whose) {
		let bank = JSON.parse(fs.readFileSync('lib/dcoin.dat.json').toString())

		let users = []
		for (let user in bank) {
			users.push(bank[user]['username'])
		}

		let w = '';

		for (let b in bank) {
			let x = whose
			let y = bank[b]['username']
			if (whose == bank[b]['username']){
				w = b
			}
		}
		if (w == '') {
			return -7
		}

		try {
			return bank[w]["amt"]
		} catch {
			return -1
		}
	}	


	function sendmoney(from,to,amt,auth) {
		let bank = JSON.parse(fs.readFileSync('lib/dcoin.dat.json').toString())

		let users = []
		for (let user in bank) {
			users.push(bank[user]['username'])
		}
		let f = '';
		let t = '';

		console.log('DAB:',from,to)

		for (let b in bank) {
			if (from == bank[b]['username']){
				f = b
			}
		}
		if (f == '') {
			return -13
		}
		
		if (to == bank['ran']['username'])
			t = "ran"
		else if (to == bank['hri']['username'])
			t = "hri"
		else if (to == bank['ris']['username'])
			t = "ris"
		else
			return -7

		let flag = 0
		for (let user of users) {
			if (user == from || user == to)
				flag++;
		}
		if (flag == 2) {
			// console.log(auth,bank[f]['auth'],amt < bank[f]["amt"])
			
			if (bank[f]["amt"] < amt) {
				return -1
			}

			console.log(auth,bank[f]['auth'])
			if (auth != bank[f]['auth']) {
				return -10;
			}
			let a = Number(amt)
			bank[t]["amt"] += a
			bank[f]["amt"] -= a
			save(bank)
			return 0;
		}
		return -11
	}
	function save(bank) {
		fs.writeFileSync('lib/dcoin.dat.json',JSON.stringify(bank))
	}
// Over

const {token} = require('../auth.json')

client.once('ready', () => {
	console.log('Ready!');
});

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'bot-everything');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./lib/welcome.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);

});

client.on('message', async (message) => {
	// if (message.content == "STOP.") {
	// 	message.channel.send("lol")
	// }
	if (!message.author.bot) {
		let content = message.content;
		
		if (content.includes("spam")) {
			let i = 1
			while (i++ < 0) {
				message.channel.send("LOL")
				i++;
			}
		}
		if (content.includes("kick")) {
			message.delete();
		}
		if (message.content.includes('<:squirky:742594858790682714>')) {
			message.react('742594858790682714')
		}
		if (content.match(/jai+.shri+.krishna+/ig)) {
			message.channel.send('Jai Shri Krishna. :pray: <:krishna:743095499405525012>')
		}
		if (content == "!j") {
			client.emit('guildMemberAdd', message.member);
		}
		
		// console.log(content)
		if (content == "!shop") {
			message.channel.send(shop())
		}
		if (content.startsWith('!buy ')) {
			let rc = buy(content.slice(5,content.length),`<@!${message.author.id}>`,message.author.username);
			if (rc == -15) {
				message.channel.send("That doesn't exist")
			} else if(rc == 0) {
				message.channel.send(`Ya bought ${content.slice(5,content.length)}`)
			}
		}
		if (content.startsWith('!min')) {
			let x = myInventory(`<@!${message.author.id}>`)

			if (typeof(x) == typeof('')) {
				message.channel.send(`${message.author.username}, your inventory contains ${x}`)
			} else {
				message.channel.send(`${message.author.username}, you own nothing... :cry:... But go ahead and buy something`)
			}
		}
		if (content.startsWith("!wm ")) {
			let i = 0;
			let ment = []
			for (let u of message.mentions.users) {
				ment.push(`<@!${u[0]}>`)
				console.log(ment[i])
				i++;
			}
			if (i != 1) {
				message.channel.send('Syntax: !wm @whose')
				return;
			}
			
			let res = whatmoney(ment[0])
			console.log(res)
			if (res < 0) {
				message.channel.send(`I think this person doesn't exist ${message.author.username}`)
			}
			else {
				message.channel.send(`${ment[0]} has **${res} DCoin**`)
			}
		}

		if (content.startsWith("!cat "))  {
			let params = content.slice(5,content.length).split(" ")
			if (params.length != 2) {
				message.channel.send(":rage:")
			}
			let kya = params[0]
			let kitna = Number(params[1])
			sell_back(message.author.username, kya, kitna)
		}

		if (content.startsWith("!sm ")) {
			let i = 0;
			let ment = []
			for (let u of message.mentions.users) {
				i++;
				
				ment.push(u[0])
			}
			if (i != 2) {
				message.channel.send('Syntax: !sm @from @to amt')
				return;
			}
			// console.log(final)
			let final = content.replace('!sm ');
			console.log(final)
			final = final.replace('  ',' ')
			final = final.replace('undefined','')
			final = final.split(' ')
			if (final.length != 3) {
				message.channel.send("Oh Come on! atleast tell me the amount")
				return
			}
			try {amt = Number(final[final.length-1])} catch {message.channel.send("I think.. i need a number. :cry:")}
			let fr = `<@!${ment[0]}>`
			let to = `<@!${ment[1]}>`
			console.log(fr,to,final)
			let r = sendmoney(fr,to,amt,message.author.username)
			if (r != 0) {
				message.channel.send(`Some Error occured. (Error code: ${r})`)
			}
			else {
				message.channel.send(`Sent ${amt} **DCoin(s) to <@!${ment[1]}>**`)
			}
		}

		if (content == "!game") {
			message.react(`742594858790682714`).then(
				() => {
					message.react(`742958699135631481`)
				}
			)
		}

        if (content.startsWith("!email ")) {
            params = content.slice(7,content.length).spilit(" ");
            to = params[0]
            sub = params[1];
            text = params.slice(2,params.length);
            send_mail(to,sub,text)
        }

		if (content.startsWith("-pop ")) {
			amt = content.slice(5,content.length)
			let rc = submit_lottery(message.author.username,amt);
			// console.log(`.${amt}.${Lottery}`,typeof(amt),typeof(Lottery))
			if (rc == 100) {
				message.channel.send(`${message.author.username}, you **won**!!`)
			} else if (rc == 0) {
				message.channel.send(`${message.author.username}, you didn't win... :cry:`)
			} else {
				message.channel.send(`${message.author.username}, NO spamming!`)
			}
		}
		// console.log("Hi!")
	}


	const filter = (reaction,user) => {
		return ['krishna', 'squirky'].includes(reaction.emoji.name);
	}
	message.awaitReactions(filter, {max: 1000, time: 600000, errors: ['time']})
		.then(
				(reactions) => {
					const reaction = reactions.first();
					if (reaction.emoji.name === 'squirky') {
						message.channel.send('Squirky!');
					} else {
						message.channel.send('Jai Shri Krishna. :pray: <:krishna:743095499405525012>');
					}
				}
			).catch(
				(r) => {
					const reaction = r;
					console.log(`!${reaction}`)
				}
			)
})

client.login(token);
