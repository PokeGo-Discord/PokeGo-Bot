import Client from './Extends/ExtendsClient'
import { Collection } from 'discord.js'
import { connectDatabase } from './Helpers/mongo'

require('dotenv').config()

const client = new Client({ partials: ['CHANNEL'], intents: 131071 })

require('./Handlers/Events')(client)
require('./Handlers/SlashCommands')(client)

connectDatabase()

client.login(process.env.botToken)
