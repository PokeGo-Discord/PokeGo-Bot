import { CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, MessageAttachment, Interaction, MessageButton, SelectMenuInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { EMBED_COLOR, POKEMON_FILE_PATH } from '../../Helpers/constants'

// TODO: GET THE USER AND SAVE IT IN THE DATABASE THEN BLOCK THE COMMAND TO USER THAT ARE ALREADY REGISTERED.
export default {
    data: {
        name: "start",
        description: "Start your adventure and choose one starter",
        options: []
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {            
        coreRecursive(interaction)
    }
} as Command

async function coreRecursive(interaction: CommandInteraction, iUpdate: SelectMenuInteraction = null) {
    const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_starter')
                    .setPlaceholder('Choose a pokemon...')
                    .addOptions(action_row),
            );
        
    const btn = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('confirm_starter')
                .setLabel('Confirm')
                .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                .setCustomId('cancel_starter')
                .setLabel('Cancel')
                .setStyle('DANGER')
            )

    if(iUpdate != null)
        await iUpdate.update({ embeds: [starterEmbed], components: [row] })
    else
        await interaction.reply({ embeds: [starterEmbed], components: [row] });

    let pokemonName = undefined;

    const filterSelect = (i: Interaction) => i.isSelectMenu() && i.customId === 'select_starter' && i.user.id === interaction.user.id;
    const collectorSelect = interaction.channel.createMessageComponentCollector({ filter:filterSelect, time: 15000 });
    collectorSelect.on('collect', async (i: SelectMenuInteraction) => {
        pokemonName = i.values[0];
        const file = new MessageAttachment(POKEMON_FILE_PATH[pokemonName].normal);
        const selectPokemonEmbed = createEmbedSelectPokemon(pokemonName, file)
        await i.update({ embeds: [selectPokemonEmbed], files: [file], components: [btn] });
        collectorSelect.stop('selected')
    });

    collectorSelect.on('end', async (collected, reason) => {
        console.log('COLLECTOR SELECT FINISH')
        if(reason === 'time') return;

        const filterCancel = (i: Interaction) => i.isButton() && i.customId === 'cancel_starter' && i.user.id === interaction.user.id;
        const collectorCancel = interaction.channel.createMessageComponentCollector({ filter:filterCancel, time: 15000 });

        const filterConfirm = i => i.customId === 'confirm_starter' && i.user.id === interaction.user.id;
        const collectorConfirm = interaction.channel.createMessageComponentCollector({ filter:filterConfirm, time: 15000 });

        collectorCancel.on('collect', async (i: SelectMenuInteraction) => {
            collectorCancel.stop()
            collectorConfirm.stop()
            coreRecursive(interaction, i);
        });


        collectorConfirm.on('collect', async (i: SelectMenuInteraction) => {
            collectorCancel.stop()
            collectorConfirm.stop()
            const helpEmbed = createHelpEmbed(pokemonName)
            await i.update({ embeds: [helpEmbed], components: [], files: [] });
        });

        collectorCancel.on('end', async (collected, reason) => {
            console.log('COLLECTOR CANCEL FINISH')
            if(reason === 'time') return;
        });

        collectorConfirm.on('end', async (collected, reason) => {
            console.log('COLLECTOR CONFIRM FINISH')
            if(reason === 'time') return;
        });
    }) 
}

/**
 * The first embed that is display with we do /start
 */
const starterEmbed = new MessageEmbed()
    .setColor(EMBED_COLOR)
    .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
    .setTitle('Welcome to the world of Pokémon!')
    .setDescription('To begin play, choose one of these pokémon with the list at the end of this message!')
    .setImage('https://i.imgur.com/rKcIRCO.png')
    .addField('Generation I', 'Bulbasaur | Charmander | Squirtle', false)
    .addField('Generation II', 'Chikorita | Cyndaquil | Totodile', false)
    .addField('Generation III', 'Treecko | Torchic | Mudkip', false)
    .addField('Generation IV', 'Turtwig | Chimchar | Piplup', false)
    .addField('Generation V', 'Snivy | Tepig | Oshawott', false)
    .addField('Generation VI', 'Chespin | Fennekin | Froakie', false)
    .addField('Generation VII', 'Rowlet | Litten | Popplio', false)
    .addField('Generation VIII', 'Grookey | Scorbunny | Sobble', false)
    .setFooter({ text: "Note: Trading in-game content for IRL money or using form of automation such as macros or selfbots to gain an unfair advantage will result in a ban (blacklist) from the bot. Don't cheat!"})


/**
 * Information embed that is display when the user finish to pick a pokemon
 */
export function createHelpEmbed(pokemonName: string): MessageEmbed {
    const helpEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR)
        .setAuthor({ name: 'Professor Oak', iconURL: 'https://images-ext-1.discordapp.net/external/tFaY5PqVp5Vyo5B3K7-Cpcrl_o-liWtFddFclOSB0V0/https/i.imgflip.com/13l2aq.jpg' })
        .setTitle('You got your first pokémon!')
        .setDescription('You can now catch pokémon and show off your Shinies and legendaries! I hope you will become the best pokemon trainer!')
        .addField('Use ``/help``', 'To see the list of commands.', false)
        .addField('Use ``/pokeinfo <pokemon>``', 'To see information about a pokemon\n_Example: ``/pokeinfo ' + pokemonName + '``_', false)
        .setFooter({ text: "Note: Trading in-game content for IRL money or using form of automation such as macros or selfbots to gain an unfair advantage will result in a ban (blacklist) from the bot. Don't cheat!"})
    return helpEmbed
}
/**
 * Create the embed for the starte that is selected
 * @param pokemonName 
 * @param file
 * @returns MessageEmbed
 */
 export function createEmbedSelectPokemon(pokemonName: string, file: MessageAttachment): MessageEmbed {
    const attachment_string = 'attachment://' + pokemonName + '.gif';
    const selectedPokemonEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR)
        .setTitle('You are about to choose ``' + pokemonName + '``!')
        .setImage(attachment_string)
        .addField('\u200b', '\u200b', false)


    return selectedPokemonEmbed;
}

/**
 * The action_row that is display in the first embed to select a starter.
 */
const action_row: MessageSelectOptionData[] = [
    {
        label: 'Bulbasaur',
        description: 'Generation I',
        value: 'bulbasaur',
    },
    {
        label: 'Charmander',
        description: 'Generation I',
        value: 'charmander',
    },
    {
        label: 'Squirtle',
        description: 'Generation I',
        value: 'squirtle',
    },
    {
        label: 'Chikorita',
        description: 'Generation II',
        value: 'chikorita',
    },
    {
        label: 'Cyndaquil',
        description: 'Generation II',
        value: 'cyndaquil',
    },
    {
        label: 'Totodile',
        description: 'Generation II',
        value: 'totodile',
    },
    {
        label: 'Treecko',
        description: 'Generation III',
        value: 'treecko',
    },
    {
        label: 'Torchic',
        description: 'Generation III',
        value: 'torchic',
    },
    {
        label: 'Mudkip',
        description: 'Generation III',
        value: 'mudkip',
    },
    {
        label: 'Turtwig',
        description: 'Generation IV',
        value: 'turtwig',
    },
    {
        label: 'Chimchar',
        description: 'Generation IV',
        value: 'chimchar',
    },
    {
        label: 'Piplup',
        description: 'Generation IV',
        value: 'piplup',
    },
    {
        label: 'Snivy',
        description: 'Generation V',
        value: 'snivy',
    },
    {
        label: 'Tepig',
        description: 'Generation V',
        value: 'tepig',
    },
    {
        label: 'Oshawott',
        description: 'Generation V',
        value: 'oshawott',
    },
    {
        label: 'Chespin',
        description: 'Generation VI',
        value: 'chespin',
    },
    {
        label: 'Fennekin',
        description: 'Generation VI',
        value: 'fennekin',
    },
    {
        label: 'Froakie',
        description: 'Generation VI',
        value: 'froakie',
    },
    {
        label: 'Rowlet',
        description: 'Generation VII',
        value: 'rowlet',
    },
    {
        label: 'Litten',
        description: 'Generation VII',
        value: 'litten',
    },
    {
        label: 'Popplio',
        description: 'Generation VII',
        value: 'popplio',
    },
    {
        label: 'Grookey',
        description: 'Generation VIII',
        value: 'grookey',
    },
    {
        label: 'Scorbunny',
        description: 'Generation VII',
        value: 'scorbunny',
    },
    {
        label: 'Sobble',
        description: 'Generation VIII',
        value: 'sobble',
    },
    
]