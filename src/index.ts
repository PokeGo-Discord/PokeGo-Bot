import { Client } from "discord.js";
require("dotenv").config();

const client = new Client({intents: 131071});
require('./Handlers/Events')(client);

client.login(process.env.botToken)

