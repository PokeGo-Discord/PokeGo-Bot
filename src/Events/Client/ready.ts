import { Client } from 'discord.js';
import * as pokemon from '../../Helpers/pokemon';
import { createGuildDataOfflined, deleteGuildDataOfflined } from '../../Database/UtilsModals/UtilsGuilds';
import { insertDataInExistingDoc } from '../../Helpers/mongo';

export default {
    name: "ready",
    once: true,

    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The client is now ready!\n");
        client.user.setActivity('POKEMON!', {type: "WATCHING"})

        // create and delete guilds that were added or deleted when the bot was offline
        createGuildDataOfflined(client)
        deleteGuildDataOfflined(client)

        insertDataInExistingDoc("guilds", {test: "Success"})

        // TODO: Make a function "main" for this and make editable variable for the Interval time
        setInterval(() => {
            pokemon.SpawningPokemon();
        }, 120 * 1000)
    }
}

