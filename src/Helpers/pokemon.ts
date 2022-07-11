import Client from '../Extends/ExtendsClient'
import { Guild, TextChannel, MessageEmbed, MessageAttachment, Message, InteractionCollector, CommandInteraction } from 'discord.js'
import { isSpawnDate, isGuildActive } from './utils'
import { isUserExist } from '../Database/UtilsModals/UtilsUsers'
import { message_count } from '../Events/Client/messageCreate'
import { updateGuildLastSpawnDate } from '../Database/UtilsModals/UtilsGuilds'
import { STATS_NAME, POKEMON_BASE_STATS, POKEMON_NAME, NATURE_MULTIPLIERS, NATURES, POKEMON_FILE_PATH, EMBED_COLOR} from './constants'
import pokemonsModal, { Pokemons } from '../Database/Modals/pokemonsModal'

export const pokemon_active: Record<string, boolean> = {}

/**
 * Class Pokemon
 */
export class Pokemon {
    owner_id: string
    owner_name: string
    name: string
    level: number
    nature: string
    ivs: Record<string, number>
    stats: Record<string, number>
    shiny: boolean

    constructor(
        pokemonName: string = undefined, 
        level: number = undefined, 
        nature: string = undefined,
        ivs: Record<string, number> = undefined,
        shiny: boolean = undefined
        ) 
    {
        this.initPokemon(pokemonName, level, nature, ivs, shiny)
    }

    /**
     * Init the pokemon, generate ivs / Stats / name / level and everything that needed for a pokemon
     */
    async initPokemon(
        pokemonName: string = undefined, 
        level: number = undefined, 
        nature: string = undefined,
        ivs: Record<string, number> = undefined,
        shiny: boolean = undefined,
        ): Promise<void> 
    {
        if(pokemonName !== undefined)
            this.name = pokemonName;
        else
            this.name = await this.initName();

        if(level !== undefined)
            this.level = level;
        else
            this.level = await this.initLevel();

        if(nature !== undefined)
            this.nature = nature;
        else
            this.nature = await this.initNature();

        if(ivs !== undefined)
            this.ivs = ivs;
        else
            this.ivs = await this.initIvs();
        
        let baseStats: Record<string, number> = await this.getBaseStats(this.name);
        this.stats = await this.updateStats(baseStats);
        
        if(shiny !== undefined)
            this.shiny = shiny;
        else
            this.shiny = await this.initShiny();
    }

    /**
     * Return a random pokemon name from the constant POKEMON_NAME
     * @returns string
     */
    private async initName(): Promise<string> {
        const keys = Object.keys(POKEMON_NAME);
        const pokemon_name = POKEMON_NAME[keys[Math.floor(Math.random() * keys.length)]];
        return pokemon_name;
    }

    /**
     * Return the level of the pokemon with percentages chances
     * @returns number
     */
     private async initLevel(): Promise<number> {
        var d: number = Math.random();
        if(d < 0.6) // 60% chance of being here
            return Math.floor(Math.random() * (35 - 1) + 1); // entre 1 et 35
        else if (d < 0.7) // 10% chance of being here
            return Math.floor(Math.random() * (75 - 55) + 55); // entre 75 et 55
        else // 30% chance of being here
            return Math.floor(Math.random() * (55 - 35) + 35); // entre 55 et 35
    }

    /**
     * Return a random nature
     * @returns string
     */
    private async initNature(): Promise<string> {
        const keys = Object.keys(NATURES);
        const nature_name = NATURES[keys[Math.floor(Math.random() * keys.length)]];
        return nature_name;
    }

    /**
     * Determine if the pokemon is shiny or not
     * @returns boolean
     */
     private async initShiny(): Promise<boolean> {
        let chance = 1 / 4096;
        return (Math.random() < chance)
    }
    
    /**
     * Initialise ivs of the pokemon
     * @returns ivs as object
     */
    private async initIvs(): Promise<Record<string, number>> {
        let ivs: Record<string, number> = {}
        for (let i = 0; i < STATS_NAME.length; i++) ivs[STATS_NAME[i]] = Math.floor(Math.random() * (32 - 1) + 1)

        return ivs
    }

    /**
     * Update stats of the pokemon
     * @param baseStats
     * @returns stats object
     */
    async updateStats(
        baseStats: Record<string, number>
    ): Promise<Record<string, number>> {
        let stats: Record<string, number> = {}
        for (let i = 0; i < STATS_NAME.length; i++)
            stats[STATS_NAME[i]] = await this.calc_stat(baseStats, STATS_NAME[i])

        return stats
    }

    /**
     * Get base stats of a pokemon by his name
     * @param pokemonName
     * @returns object
     */
    async getBaseStats(
        pokemonName: string
    ): Promise<Record<string, number>> {
        const baseStats = POKEMON_BASE_STATS[pokemonName]
        return baseStats
    }

    /**
     * Calcule les stats du pokemon
     * @param baseStats
     * @param key ex: 'atk'
     * @returns number
     */
    private calc_stat(baseStats: Record<string, number>, statName: string): number {
        if(statName == 'hp')
            return Math.floor(
                Math.floor((((this.ivs[statName] + 2 * baseStats[statName]) * this.level) / 100)) + this.level + 10
            )
        else
            return Math.floor(
                (Math.floor(((this.ivs[statName] + 2 * baseStats[statName]) * this.level) / 100) + 5) * NATURE_MULTIPLIERS[this.nature][statName]
            )
    }
}

/**
 * Spawn a pokemon to the guild.
 * @param guildId
 */
export async function SpawningPokemon(guild: Guild, client: Client): Promise<void> {
    // Reset message_count
    message_count[guild.id] = 0;
    updateGuildLastSpawnDate(guild.id);

    pokemon_active[guild.id] = true;

    const pokemon = new Pokemon();
    await pokemon.initPokemon();
    console.log(pokemon.name);

    const channel: TextChannel = client.channels.cache.get("993368815989694477") as TextChannel;
    await sendEmbedPokemon(channel, pokemon.name)

    const collector = await new InteractionCollector(client, {channel: channel, interactionType: 'APPLICATION_COMMAND', guild: channel.guild, time: 15000})

    collector.on("collect", async (i: CommandInteraction) => {
        if(i.commandName != 'catch' || i.type != "APPLICATION_COMMAND") return
        
        const isRegistered = await isUserExist(i.user.id)
        if(!isRegistered)
            return i.reply({ content: 'You are not registered, please do: ``/start`` and choose a starter pokemon!', ephemeral:true})
            
        const { options } = i
        const res = options.getString('pokemon');
        if(pokemon.name !== res) 
            return i.reply({ content: 'That is the wrong pokémon', ephemeral:true });

        i.reply({ content:'That is the good pokémon', ephemeral: true})
        channel.send(i.user.username + ' found the correct pokemon, it was ' + pokemon.name)
        pokemon.owner_id = i.user.id;
        pokemon.owner_name = i.user.username;
        collector.stop('finded')
    })

    collector.on('end', (collected, reason) => {
        if(!reason)
            channel.send('Nobody find the correct answere')

        pokemonsModal.create({
            owner_id: pokemon.owner_id,
            owner_name: pokemon.owner_name,
            name: pokemon.name,
            level: pokemon.level,
            nature: pokemon.nature,
            ivs: pokemon.ivs,
            stats: pokemon.stats,
            shiny: pokemon.shiny,
        })

        pokemon_active[guild.id] = false;
        delete pokemon_active[guild.id];
    });

}

/**
 * Create the embed pokemon and send it
 * @param channel 
 * @param pokemonName 
 * @returns Message boolean
 */
export async function sendEmbedPokemon(channel: TextChannel, pokemonName: string): Promise<Message<boolean>> {
    const file = new MessageAttachment(POKEMON_FILE_PATH[pokemonName].normal);
    const attachment_string = 'attachment://' + pokemonName + '.gif';
    const pokemonEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR)
        .setTitle('A wild pokémon has appeared!')
        .setDescription('Guess the pokémon and type ``/catch <pokemon>`` to catch it!')
        .setImage(attachment_string)

    return await channel.send({ embeds: [pokemonEmbed], files:[file] });
}

/**
 * Return true if a pokemon can spawn, or false if a pokemon can't spawn.
 * @param guildId
 * @returns boolean
 */
export async function isSpawnable(guildId: string): Promise<boolean> {
    let isActive = await isGuildActive(guildId)
    let isDate = await isSpawnDate(guildId)
    console.log(isActive + ' ' + isDate)
    if (!isActive || !isDate ||  pokemon_active[guildId]) return false

    return true
}
