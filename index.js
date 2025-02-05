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