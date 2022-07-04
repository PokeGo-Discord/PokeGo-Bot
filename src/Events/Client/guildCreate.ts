import { Guild } from 'discord.js';
import * as guildData from '../../Database/UtilsModals/UtilsGuilds'

export default {
    name: "guildCreate",
    once: false,

    /**
     * @param {Guild} guild
     */
    execute(guild) {
        guildData.isGuildExist(guild.id).then((isExist: boolean) => {
            if(isExist) return

            guildData.createGuildData(guild.id);

        })
    }
}

