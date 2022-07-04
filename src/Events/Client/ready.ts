import { Client } from 'discord.js';

export default {
    name: "ready",
    once: true,

    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The client is now ready!");
        client.user.setActivity('POKEMON!', {type: "WATCHING"})
    }
}