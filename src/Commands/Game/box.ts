import { CommandInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { pokemon_active } from '../../Helpers/pokemon'
import { getBoxsUser } from '../../Database/UtilsModals/UtilsBoxs'
import { type } from 'os'
import { getTeamUser } from '../../Database/UtilsModals/UtilsTeams'

export default {
    data: {
        name: "box",
        type: 1,
        description: "Swap a pokemon from your box",
        options: [{
          name: "info",
          type: 3,
          description: "Display information about your selected pokemon",
        }]
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        // TODO: Check if the box lenght is less than 9
        // TODO: Check if the team of the user have more than one pokemon
        
        const boxsUser = await getBoxsUser(interaction.user.id)
        const teamUser = await getTeamUser(interaction.user.id)
        boxsUser[0].pokemons_id.push(teamUser.pokemons_id[0])
        boxsUser[0].save()
    }
} as Command