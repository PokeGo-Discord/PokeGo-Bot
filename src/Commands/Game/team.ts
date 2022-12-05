import { CommandInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { pokemon_active } from '../../Helpers/pokemon'
import { isUserExist } from '../../Database/UtilsModals/UtilsUsers'
import { createEmbedNoRegisted } from '../../Helpers/utils'
import { EMBED_COLOR } from '../../Helpers/constants'
import { getPokemonsUser } from '../../Database/UtilsModals/UtilsUsers'
import { getBaseStats } from '../../Api/pokemonApi'
import { getTeamUser } from '../../Database/UtilsModals/UtilsTeams'

export default {
    data: {
        name: "team",
        type: 1,
        description: "Show your team",
        options: []
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        if(await !isUserExist(interaction.user.id)) return interaction.reply({embeds: [createEmbedNoRegisted()], ephemeral: true});

        getTeamUser(interaction.user.id)
    }
} as Command