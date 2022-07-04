import { Client } from 'discord.js';
import * as pokemon from '../../Helpers/pokemon';
import { createGuildDataOfflined, deleteGuildDataOfflined } from '../../Database/UtilsModals/UtilsGuilds';

export default {
    name: "ready",
    once: true,

    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The client is now ready!\n");
        client.user.setActivity('POKEMON!', {type: "WATCHING"})

        createGuildDataOfflined(client)
        deleteGuildDataOfflined(client)

        setInterval(() => {
            pokemon.SpawningPokemon();
        }, 120 * 1000)
    }
}

