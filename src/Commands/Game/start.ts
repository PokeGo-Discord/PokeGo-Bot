import { CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { EMBED_COLOR } from '../../Helpers/constants'

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
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Choose a pokemon...')
                    .addOptions(action_row),
            );

        await interaction.reply({ embeds: [starterEmbed], components: [row] });

        client.on('interactionCreate', interaction => {
            if (!interaction.isSelectMenu()) return;
            console.log(interaction);
        });
    }
} as Command

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

const action_row: MessageSelectOptionData[] = [
    {
        label: 'Bulbasaur',
        description: 'Generation I',
        value: '1',
    },
    {
        label: 'Charmander',
        description: 'Generation I',
        value: '2',
    },
    {
        label: 'Squirtle',
        description: 'Generation I',
        value: '3',
    },
    {
        label: 'Chikorita',
        description: 'Generation II',
        value: '4',
    },
    {
        label: 'Cyndaquil',
        description: 'Generation II',
        value: '5',
    },
    {
        label: 'Totodile',
        description: 'Generation II',
        value: '6',
    },
    {
        label: 'Treecko',
        description: 'Generation III',
        value: '7',
    },
    {
        label: 'Torchic',
        description: 'Generation III',
        value: '8',
    },
    {
        label: 'Mudkip',
        description: 'Generation III',
        value: '9',
    },
    {
        label: 'Turtwig',
        description: 'Generation IV',
        value: '10',
    },
    {
        label: 'Chimchar',
        description: 'Generation IV',
        value: '11',
    },
    {
        label: 'Piplup',
        description: 'Generation IV',
        value: '12',
    },
    {
        label: 'Snivy',
        description: 'Generation V',
        value: '13',
    },
    {
        label: 'Tepig',
        description: 'Generation V',
        value: '14',
    },
    {
        label: 'Oshawott',
        description: 'Generation V',
        value: '15',
    },
    {
        label: 'Chespin',
        description: 'Generation VI',
        value: '16',
    },
    {
        label: 'Fennekin',
        description: 'Generation VI',
        value: '17',
    },
    {
        label: 'Froakie',
        description: 'Generation VI',
        value: '18',
    },
    {
        label: 'Rowlet',
        description: 'Generation VII',
        value: '19',
    },
    {
        label: 'Litten',
        description: 'Generation VII',
        value: '20',
    },
    {
        label: 'Popplio',
        description: 'Generation VII',
        value: '21',
    },
    {
        label: 'Grookey',
        description: 'Generation VIII',
        value: '22',
    },
    {
        label: 'Scorbunny',
        description: 'Generation VII',
        value: '23',
    },
    {
        label: 'Sobble',
        description: 'Generation VIII',
        value: '24',
    },
    
]