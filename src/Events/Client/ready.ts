import { Client, Guild } from 'discord.js';
import * as pokemon from '../../Helpers/pokemon';
import { createGuildDataOfflined, deleteGuildDataOfflined } from '../../Database/UtilsModals/UtilsGuilds';
import { fetchAllGuild, isGuildActive } from '../../Helpers/utils';
import { updateKeyInExistingDoc, insertDataInExistingDoc, deleteDataInExistingDoc } from '../../Helpers/mongo';



export default {
    name: "ready",
    once: true,

    /**
     * @param {Client} client
     */
    execute(client: Client) {
        console.log("The client is now ready!\n");
        client.user.setActivity('POKEMON!', {type: "WATCHING"})

        // create and delete guilds that were added or deleted when the bot was offline
        createGuildDataOfflined(client)
        deleteGuildDataOfflined(client)

        /* Delete key 'test' of all docs from guilds collection
        deleteDataInExistingDoc('guilds', { messageCooldown: "" }) */

        /* Insert data to all document of all docs from guilds collection
        insertDataInExistingDoc('guilds', {'messageCooldown': Date.now()}) */

        /* Update the key 'spawnRemaining' to 'lastSpawnDate' of all docs from guilds collection
        updateKeyInExistingDoc('guilds', {'spawnRemaining': 'lastSpawnDate'}) */

        // TODO: Make a function "main" for this and make editable variable for the Interval time
        setInterval(() => {
            fetchAllGuild(client).forEach(guild => {
                pokemon.isSpawnable(guild.id).then((bool) => {
                    if(!bool) return
                    pokemon.SpawningPokemon(guild.id);
                })

                return;
            })
        }, 1 * 5000)
    }
}