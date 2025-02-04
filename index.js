require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const {Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const { CommandHandler } = require('djs-commander');
const path = require('path');
const client = new Client({ 
    intents: [
        Guilds,
        GuildMessages,
        MessageContent
    ]
});
new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
});
client.login(process.env.TOKEN);

client.once('ready', () => console.log(client.user.tag+'6준비 완료!9'));

client.on('messageCreate', (msg) => {
    console.log(`messageCreate: ${msg}`);
    const cmd = msg.content
    if(msg.author.bot) return
    if(cmd == 'ㅎㅇ') msg.reply('안녕하세요!')
    if(cmd == '노모어') msg.channel.send('바나나')
    if(cmd == '삭제') {
        msg.delete()
        msg.reply('6삭제 완료!9')
    }
});