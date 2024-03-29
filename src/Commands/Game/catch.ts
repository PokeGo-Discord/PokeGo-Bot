import { CommandInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { pokemon_active } from '../../Helpers/pokemon'

export default {
    data: {
        name: "catch",
        description: "Catch a pokemon",
        type: 1,
        options: [
            {
                name: "pokemon",
                description: "Give the name of the pokemon",
                type: 3,
                required: true,
            }
        ]
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute(interaction: CommandInteraction, client: Client) {
        if(pokemon_active[interaction.guild.id])
            return;
        else
            interaction.reply({ content: 'No pokemon to catch', ephemeral: true });
    }
} as Command