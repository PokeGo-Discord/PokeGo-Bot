import { Client } from 'discord.js'
import { connectDatabase } from './Helpers/mongo'
require('dotenv').config()

const client = new Client({ partials: ['CHANNEL'], intents: 131071 })
require('./Handlers/Events')(client)
connectDatabase()

client.login(process.env.botToken)
