import { Guild } from 'discord.js';
import * as guildData from '../../Database/UtilsModals/UtilsGuilds'

export default {
    name: "guildDelete",
    once: false,

    /**
     * @param {Guild} guild
     */
    execute(guild) {
        guildData.deleteGuildData(guild.id);
    }
}

