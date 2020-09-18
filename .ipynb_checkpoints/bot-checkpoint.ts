import Discord = require('discord.js')
import fs = require('fs');

const client = new Discord.Client();
const {token} = JSON.parse(fs.readFileSync('../auth.json').toString());

var binod_kill = false;

const randomMsgs: string[] = [
    "Hi",
    "Bye",
    "Dab",
    "But don't spam",
    "I like cats ;)",
    "I shall say that word is cursed",
    "No don't think so"
];

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', (msg) => {
    if (!msg.author.bot) {
        let content: string = msg.content;
        let author = msg.author;
        let channel = msg.channel;
        if (content == "!ping-ts") {
            channel.send("Hola TypeScript!")
        }
        
        // console.log(msg.guild["members"]);

        if (content == "!kmo" && author.username == "RK") {
            binod_kill = !binod_kill
        }
        // console.log()
        if ((content.match(/binod/ig) || content.match(/b i n o d/ig)) && binod_kill ) {
            msg.delete({timeout:0})
        }

        if (content.includes("spam")) {
            for (let i: number = 0; i < 10; i++) {
                let randindex = Math.floor(Math.random()*randomMsgs.length)
                channel.send(
                    randomMsgs[
                        randindex
                    ]
                )
            }
        }
    }
})

client.login(token)