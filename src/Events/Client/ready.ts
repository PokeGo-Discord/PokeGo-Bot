import Client from '../../Extends/ExtendsClient'
import { ApplicationCommandDataResolvable, Message } from 'discord.js'
import * as pokemon from '../../Helpers/pokemon'
import {
    createGuildDataOfflined,
    deleteGuildDataOfflined,
} from '../../Database/UtilsModals/UtilsGuilds'
import { fetchAllGuild } from '../../Helpers/utils'
import {
    updateKeyInExistingDoc,
    insertDataInExistingDoc,
    deleteDataInExistingDoc,
} from '../../Helpers/mongo'
import { Config } from '../../Typings/config'
const config: Config = require('../../config.json')

// TODO: make config variable configurable per each guild (DATABASE)

export default {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client
     */
    execute(client: Client, message: Message) {
        console.log('The client is now ready!\n')

        client.application.commands.set(client.commands.map(v => v.data) as ApplicationCommandDataResolvable[])

        client.guilds.cache.get('993372172355645441').commands.set(client.guildCommands.map(v => v.data) as ApplicationCommandDataResolvable[])

        client.user.setActivity('POKEMON!', { type: 'WATCHING' })

        // create and delete guilds that were added or deleted when the bot was offline
        createGuildDataOfflined(client)
        deleteGuildDataOfflined(client)

        /* Delete key 'test' of all docs from guilds collection
        deleteDataInExistingDoc('guilds', { messageCooldown: "" }) */

        /* Insert data to all document of all docs from guilds collection
        insertDataInExistingDoc('guilds', {'lastMessageDate': Date.now()})*/

        /* Update the key 'spawnRemaining' to 'lastSpawnDate' of all docs from guilds collection
        updateKeyInExistingDoc('guilds', {'spawnRemaining': 'lastSpawnDate'}) */

        // TODO: Make a function "main" for this and make editable variable for the Interval time
        setInterval(() => {
            fetchAllGuild(client).forEach((guild) => {
                pokemon.isSpawnable(guild.id).then((bool) => {
                    if (!bool) return
                    pokemon.SpawningPokemon(guild, client)
                })

                return
            })
        }, config.readyCooldown * 60000) // Each 2min
    },
}
