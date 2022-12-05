import { CommandInteraction, Interaction, Message, SelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { getOnlyNamePokemonsUser } from '../../Database/UtilsModals/UtilsUsers'
import { EMBED_COLOR } from '../../Helpers/constants'
import { getAllPokemonName } from '../../Api/PokemonApi'

export default {
    data: {
        name: "pokedex",
        description: "Display the pokedex",
        options: [
            {
                name: "pokemon",
                description: "Give the name or the number of a pokemon to get more information about him from the pokedex.",
                type: 3,
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

    if(page < 0)
        page = 45
    else if(page > 45)
        page = 0

    const pokemonName = await getOnlyNamePokemonsUser(interaction.user.id)
    console.log(pokemonName)
    const p = (20 * page)
    const slicedPokemon = await getAllPokemonName(p) as string[];
    const pokeballEmoji = interaction.client.emojis.cache.get("1008496323768631318");
    const pokedexEmbed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
    .setTitle(`${interaction.user.username} Pokedex`)

    var str = `You have caught ${pokemonName.length} out of 905 pokémon\n\n`
    let idx = p
    slicedPokemon.forEach(e => {
        idx++
        const ayy = interaction.client.emojis.cache.find(emoji => emoji.name === e.replace(/\-/g, ''));
        const isCatch = pokemonName.includes(e.toLowerCase())
        if(isCatch)
            str += "``" + `#${lpad(idx, 3, 0)}` + "``⠀" + `${ayy} ${e}` + "⠀" + `${pokeballEmoji}` + "\n"
        else
            str += "``" + `#${lpad(idx, 3, 0)}` + "``⠀" + `${ayy} ${e}` + "⠀" + "\n"
    });
    pokedexEmbed.setDescription(str)

    const btn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('previous_page')
        .setLabel('◀️')
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
        .setCustomId('next_page')
        .setLabel('▶️')
        .setStyle(ButtonStyle.Primary)
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

function lpad(s, width, char) {
    return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
}