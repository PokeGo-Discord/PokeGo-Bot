import { Client, Message } from 'discord.js';
import * as guildData from '../../Database/UtilsModals/UtilsGuilds'
import { isSpamming } from '../../Helpers/utils';

const cooldown_users: Record<string, number> = {};

export default {
    name: "messageCreate",
    once: false,

    /**
     * @param {Message} message
     * @param {Client} client
     */
    execute(message: Message, client: Client) {
        if(message.author.bot) return;                                                                    
        
        let currentTime = Date.now();

        // Detect sppam
        if(isSpamming(currentTime, cooldown_users, message))
            return

        console.log(cooldown_users);
    }
}

