import { Client, Message } from 'discord.js';
import { isSpamming } from '../../Helpers/utils';
import { updateGuildLastMessageDate } from '../../Database/UtilsModals/UtilsGuilds';

export const cooldown_users: Record<string, number> = {};
export const message_count: Record<string, number> = {};

export default {
    name: "messageCreate",
    once: false,

    /**
     * @param {Message} message
     * @param {Client} client
     */
    execute(message: Message, client: Client) {
        if(message.author.bot || !message.guildId) return;                                                                    
        
        let currentTime = Date.now();

        // Detect spam
        if(isSpamming(currentTime, cooldown_users, message.author.id))
            return

        // Update lastMessageDate in db
        updateGuildLastMessageDate(message.guildId);

        // Guild activity
        message_count[message.guildId] = (message_count[message.guildId] ? message_count[message.guildId] : 0) + 1;

        console.log(cooldown_users);
    }
}

