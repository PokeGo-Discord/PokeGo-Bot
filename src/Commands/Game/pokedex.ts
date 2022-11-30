import { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Interaction, Message, SelectMenuInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { pokemon_active } from '../../Helpers/pokemon'
import { getOnlyNamePokemonsUser, getPokemonsUser, isUserExist } from '../../Database/UtilsModals/UtilsUsers'
import { createEmbedNoRegisted } from '../../Helpers/utils'
import { EMBED_COLOR, ID_DEX, POKEMON_DEX, POKEMON_NAME } from '../../Helpers/constants'

export default {
    data: {
        name: "pokedex",
        description: "Display the pokedex",
        options: [
            {
                name: "pokemon",
                description: "Give the name or the number of a pokemon to get more information about him from the pokedex.",
                type: "STRING",
                required: false,   
            }
        ]
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        displayPokedex(interaction, 0)
    }
} as Command

async function displayPokedex(interaction: CommandInteraction, page: number, iUpdate: SelectMenuInteraction = null) {
    const pokemonName = await getOnlyNamePokemonsUser(interaction.user.id)
    console.log(pokemonName)
    const p = (10 * page)
    const slicedPokemon = POKEMON_DEX.slice(p, p + 10);
    const slicedId = ID_DEX.slice(p, p + 10)
    const pokeballEmoji = interaction.client.emojis.cache.get("1008496323768631318");
    const pokedexEmbed = new MessageEmbed()
    .setColor(EMBED_COLOR)
    .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
    .setTitle(`${interaction.user.username} Pokedex`)

    var str = `You have caught ${pokemonName.length} out of 905 pokémon\n\n`
    let idx = 0
    slicedPokemon.forEach(e => {
        const ayy = interaction.client.emojis.cache.find(emoji => emoji.name === e);
        const isCatch = pokemonName.includes(e.toLowerCase())
        if(isCatch)
            str += "``" + `#${slicedId[idx]}` + "``⠀" + `${ayy} ${e}` + "⠀" + `${pokeballEmoji}` + "\n"
        else
            str += "``" + `#${slicedId[idx]}` + "``⠀" + `${ayy} ${e}` + "⠀" + "\n"
        idx++
    });
    pokedexEmbed.setDescription(str)

    const btn = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('previous_page')
        .setLabel('◀️')
        .setStyle('PRIMARY')
    )
    .addComponents(
        new MessageButton()
        .setCustomId('next_page')
        .setLabel('▶️')
        .setStyle('PRIMARY')
    )
    if(iUpdate != null)
        await iUpdate.update({ embeds: [pokedexEmbed], components: [btn] })
    else
        await interaction.reply({ embeds: [pokedexEmbed], components: [btn]});

    const message = await interaction.fetchReply() as Message

    const filterPrevious = (i: Interaction) => i.isButton() && i.customId === 'previous_page' && i.user.id === interaction.user.id;
    const collectorPrevious = message.createMessageComponentCollector({ filter:filterPrevious, time: 15000 });

    const filterNext = (i: Interaction) => i.isButton() && i.customId === 'next_page' && i.user.id === interaction.user.id;
    const collectorNext = message.createMessageComponentCollector({ filter:filterNext, time: 15000 });

    collectorPrevious.on('collect', async (i: SelectMenuInteraction) => {
        collectorNext.stop()
        collectorPrevious.stop()
        displayPokedex(interaction, page - 1, i)
    });

    collectorNext.on('collect', async (i: SelectMenuInteraction) => {
        collectorNext.stop()
        collectorPrevious.stop()
        displayPokedex(interaction, page + 1, i)
    });
}