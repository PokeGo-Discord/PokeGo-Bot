const { Client } = require('discord.js');
const client = new Client({intents: 131071});
require('dotenv').config();

client.once("ready", () => {
    console.log("The bot is now online!");
    client.user.setActivity("Hello!")
})

client.login(process.env.TOKEN)