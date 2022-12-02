import { CommandInteraction, MessageEmbed } from 'discord.js'
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
        name: "info",
        description: "Display information about your selected pokemon",
        options: []
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        if(await !isUserExist(interaction.user.id)) return interaction.reply({embeds: [createEmbedNoRegisted()], ephemeral: true});

        const statsEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('You are not registered!')
        .setDescription('Please do: ``/start`` and choose a starter pokemon!')
        
        getTeamUser(interaction.user.id)
    }
} as Command