import Client from './Extends/ExtendsClient'
import { Collection, Partials } from 'discord.js'
import { connectDatabase } from './Helpers/mongo'

require('dotenv').config()

const client = new Client({ partials: [Partials.Channel], intents: 131071 })

require('./Handlers/Events')(client)
require('./Handlers/Commands')(client)

connectDatabase()

client.login(process.env.botToken)
