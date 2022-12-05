import { CommandInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { purgeAllDoc } from '../../Helpers/mongo'
import { createGuildDataOfflined } from '../../Database/UtilsModals/UtilsGuilds'

export default {
    data: {
        name: "purgedb",
        description: "Purge all database documents",
        options: []
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        purgeAllDoc('Guilds')
    }
} as Command