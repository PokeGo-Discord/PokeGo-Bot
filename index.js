const { Client } = require('discord.js');
const client = new Client({intents: 131071});
require('dotenv').config();

require('./Handlers/Events')(client);

client.login(process.env.TOKEN)