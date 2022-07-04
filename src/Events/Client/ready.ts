import { Client } from 'discord.js';
import * as pokemon from '../../Helpers/pokemon';

export default {
    name: "ready",
    once: true,

    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The client is now ready!");
        client.user.setActivity('POKEMON!', {type: "WATCHING"})
        
        setInterval(() => {
            pokemon.SpawningPokemon();
        }, 120 * 1000)
    }
}

