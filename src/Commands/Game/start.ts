import { CommandInteraction, Interaction , Message, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ButtonBuilder, ButtonStyle, AttachmentBuilder, CacheType, EmbedBuilder, Embed, MessageSelectOption, APISelectMenuComponent, APISelectMenuOption, SelectMenuBuilder} from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { EMBED_COLOR, POKEMON_NORMAL_FILE_PATH } from '../../Helpers/constants'
import usersModal from '../../Database/Modals/usersModal'
import { isUserExist } from '../../Database/UtilsModals/UtilsUsers'
import { Pokemon } from '../../Helpers/pokemon'
import { Team } from '../../Helpers/teams'
import pokemonsModal from '../../Database/Modals/pokemonsModal'
import teamsModal from '../../Database/Modals/teamsModal'
import { getPathFile } from '../../Helpers/utils'
import { getSpecieName } from '../../Api/PokemonApi'
import boxModal from '../../Database/Modals/boxModal'

export default {
    data: {
        name: "start",
        type: 1,
        description: "Start your adventure and choose one starter",
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) { 
        if(await isUserExist(interaction.user.id)) return interaction.reply({embeds: [createEmbedAlreadyRegisted()], ephemeral: true});
        coreRecursive(interaction)
    }
} as Command

async function coreRecursive(interaction: CommandInteraction, iUpdate: StringSelectMenuInteraction = null) {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_starter')
                    .setPlaceholder('Choose a pokemon...')
                    .addOptions(action_row),
            );
        
    const btn = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('confirm_starter')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId('cancel_starter')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
            )

    if(iUpdate != null)
        await iUpdate.update({ embeds: [starterEmbed], components: [row], files: [] })
    else
        await interaction.reply({ embeds: [starterEmbed], components: [row], ephemeral: true });

    const message = await interaction.fetchReply() as Message

    let pokemonId = undefined;
    let pokemonName = undefined;


    const filterSelect = (i: Interaction) => i.isSelectMenu() && i.customId === 'select_starter' && i.user.id === interaction.user.id;
    const collectorSelect = message.createMessageComponentCollector({ filter:filterSelect, time: 30000 });
    collectorSelect.on('collect', async (i: StringSelectMenuInteraction) => {
        pokemonId = i.values[0];
        const pokemonName = await getSpecieName(pokemonId)
        const file = new AttachmentBuilder(getPathFile(pokemonName));
        const selectPokemonEmbed = createEmbedSelectPokemon(pokemonName, file)
        await i.update({ embeds: [selectPokemonEmbed], files: [file], components: [btn] });
        collectorSelect.stop('selected')
    });

    collectorSelect.on('end', async (collected, reason) => {       
        if(reason === 'time') {
            interaction.editReply({embeds: [createEmbedNoResponse()], components: [], files: []}) 
            return
        }

        const filterCancel = (i: Interaction) => i.isButton() && i.customId === 'cancel_starter' && i.user.id === interaction.user.id;
        const collectorCancel = message.createMessageComponentCollector({ filter:filterCancel, time: 15000 });

        const filterConfirm = (i: Interaction) => i.isButton() && i.customId === 'confirm_starter' && i.user.id === interaction.user.id;
        const collectorConfirm = message.createMessageComponentCollector({ filter:filterConfirm, time: 15000 });

        collectorCancel.on('collect', async (i: StringSelectMenuInteraction) => {
            collectorCancel.stop()
            collectorConfirm.stop()
            coreRecursive(interaction, i);
        });


        collectorConfirm.on('collect', async (i: StringSelectMenuInteraction) => {
            collectorCancel.stop()
            collectorConfirm.stop()

            if(await isUserExist(i.user.id)) return void (i.update({embeds: [createEmbedAlreadyRegisted()]}));

            let User = await usersModal.create({
                userId: i.user.id,
                numberPokemon: 1,
            })

            const starter = new Pokemon()
            await starter.initPokemon(User.id, pokemonId)

            let pokemon = await pokemonsModal.create({
                owner_id: starter.owner_id,
                pokemonId: starter.pokemonId,
                name: starter.name,
                level: starter.level,
                nature: starter.nature,
                ivs: starter.ivs,
                stats: starter.stats,
                shiny: starter.shiny,
            })

            const team = new Team()
            await team.initTeam(User.id, pokemon.id)

            await teamsModal.create({
                owner_id: team.owner_id,
                pokemons_id: team.pokemons_id,
            })
            
            await boxModal.create({
                owner_id: User.id
            })

            const helpEmbed = createHelpEmbed(pokemonName)
            await i.update({ embeds: [helpEmbed], components: [], files: [] });
        });

        collectorCancel.on('end', async (collected, reason) => {
            if(reason === 'time') {
                interaction.editReply({embeds: [createEmbedNoResponse()], components: [], files: []}) 
                return
            }
            console.log('COLLECTOR CANCEL FINISH')
        });

        collectorConfirm.on('end', async (collected, reason) => {
            if(reason === 'time') {
                interaction.editReply({embeds: [createEmbedNoResponse()], components: [], files: []}) 
                return
            }
            console.log('COLLECTOR CONFIRM FINISH')
        });
    }) 
}

/**
 * The first embed that is display with we do /start
 */
const starterEmbed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
    .setTitle('Welcome to the world of Pokémon!')
    .setDescription('To begin play, choose one of these pokémon with the list at the end of this message!')
    .setImage('https://i.imgur.com/rKcIRCO.png')
    .addFields([
        {name: 'Generation I', value: 'Bulbasaur | Charmander | Squirtle'},
        {name: 'Generation II', value: 'Chikorita | Cyndaquil | Totodile'},
        {name: 'Generation III', value: 'Treecko | Torchic | Mudkip'},
        {name: 'Generation IV', value: 'Turtwig | Chimchar | Piplup'},
        {name: 'Generation V', value: 'Snivy | Tepig | Oshawott'},
        {name: 'Generation VI', value: 'Chespin | Fennekin | Froakie'},
        {name: 'Generation VII', value: 'Rowlet | Litten | Popplio'},
        {name: 'Generation VIII', value: 'Grookey | Scorbunny | Sobble'},

    ])
    .setFooter({ text: "Note: Trading in-game content for IRL money or using form of automation such as macros or selfbots to gain an unfair advantage will result in a ban (blacklist) from the bot. Don't cheat!"})


/**
 * Information embed that is display when the user finish to pick a pokemon
 */
export function createHelpEmbed(pokemonName: string): EmbedBuilder {
    const helpEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('You got your first pokémon!')
        .setDescription('You can now catch pokémon and show off your Shinies and legendaries! I hope you will become the best pokemon trainer!')
        .addFields([
            {name: 'Use ``/help``', value:'To see the list of commands.'},
            {name: 'Use ``/pokeinfo <pokemon>``', value:'To see information about a pokemon\n_Example: ``/pokeinfo ' + pokemonName + '``_'},

        ])
        .setFooter({ text: "Note: Trading in-game content for IRL money or using form of automation such as macros or selfbots to gain an unfair advantage will result in a ban (blacklist) from the bot. Don't cheat!"})
    return helpEmbed
}
/**
 * Create the embed for the starte that is selected
 * @param pokemonName 
 * @param file
 * @returns MessageEmbed
 */
 export function createEmbedSelectPokemon(pokemonName: string, file: AttachmentBuilder): EmbedBuilder {
    const attachment_string = 'attachment://' + pokemonName + '.gif';
    const selectedPokemonEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('You are about to choose ``' + pokemonName + '``!')
        .setImage(attachment_string)
        .addFields([
            {name:'\u200b', value:'\u200b'}
        ])

    return selectedPokemonEmbed;
}

 export function createEmbedAlreadyRegisted(): EmbedBuilder {
    const embedAlreadyRegisted = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('You are already registered!')
        .setDescription('You can already catch pokémon and show off your Shinies and legendaries! I hope you will become the best pokemon trainer!')


    return embedAlreadyRegisted;
}

export function createEmbedNoResponse(): EmbedBuilder {
    const embedNoResponse = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('Are you still here?')
        .setDescription('You took too long to answer, redo /start to start again!')


    return embedNoResponse;
}

/**
 * The action_row that is display in the first embed to select a starter.
 */
const action_row: APISelectMenuOption[] = [
    {
        label: 'Bulbasaur',
        description: 'Generation I',
        value: '1',
    },
    {
        label: 'Charmander',
        description: 'Generation I',
        value: '4',
    },
    {
        label: 'Squirtle',
        description: 'Generation I',
        value: '7',
    },
    {
        label: 'Chikorita',
        description: 'Generation II',
        value: '152',
    },
    {
        label: 'Cyndaquil',
        description: 'Generation II',
        value: '155',
    },
    {
        label: 'Totodile',
        description: 'Generation II',
        value: '158',
    },
    {
        label: 'Treecko',
        description: 'Generation III',
        value: '252',
    },
    {
        label: 'Torchic',
        description: 'Generation III',
        value: '255',
    },
    {
        label: 'Mudkip',
        description: 'Generation III',
        value: '258',
    },
    {
        label: 'Turtwig',
        description: 'Generation IV',
        value: '387',
    },
    {
        label: 'Chimchar',
        description: 'Generation IV',
        value: '390',
    },
    {
        label: 'Piplup',
        description: 'Generation IV',
        value: '393',
    },
    {
        label: 'Snivy',
        description: 'Generation V',
        value: '495',
    },
    {
        label: 'Tepig',
        description: 'Generation V',
        value: '498',
    },
    {
        label: 'Oshawott',
        description: 'Generation V',
        value: '501',
    },
    {
        label: 'Chespin',
        description: 'Generation VI',
        value: '650',
    },
    {
        label: 'Fennekin',
        description: 'Generation VI',
        value: '653',
    },
    {
        label: 'Froakie',
        description: 'Generation VI',
        value: '656',
    },
    {
        label: 'Rowlet',
        description: 'Generation VII',
        value: '722',
    },
    {
        label: 'Litten',
        description: 'Generation VII',
        value: '725',
    },
    {
        label: 'Popplio',
        description: 'Generation VII',
        value: '728',
    },
    {
        label: 'Grookey',
        description: 'Generation VIII',
        value: '810',
    },
    {
        label: 'Scorbunny',
        description: 'Generation VII',
        value: '813',
    },
    {
        label: 'Sobble',
        description: 'Generation VIII',
        value: '816',
    },
    
]