import { isSpawnDate, isGuildActive } from './utils'
import { message_count } from '../Events/Client/messageCreate'
import { updateGuildLastSpawnDate } from '../Database/UtilsModals/UtilsGuilds'
import { STATS_NAME, POKEMON_BASE_STATS, POKEMON_NAME, NATURE_MULTIPLIERS, NATURES} from './constants'

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

    /**
     * Init the pokemon, generate ivs / Stats / name / level and everything that needed for a pokemon
     */
    async initPokemon(): Promise<void> {
        this.name = await this.initName();
        this.level = await this.initLevel();
        this.nature = await this.initNature();
        this.ivs = await this.initIvs();
        
        let baseStats: Record<string, number> = await this.getBaseStats(this.name);
        this.stats = await this.updateStats(baseStats);
        
        this.shiny = await this.initShiny();
    }

    /**
     * Return a random pokemon name from the constant POKEMON_NAME
     * @returns string
     */
    async initName(): Promise<string> {
        const keys = Object.keys(POKEMON_NAME);
        const pokemon_name = POKEMON_NAME[keys[Math.floor(Math.random() * keys.length)]];
        return pokemon_name;
    }

    /**
     * Return the level of the pokemon with percentages chances
     * @returns number
     */
    async initLevel(): Promise<number> {
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
    async initNature(): Promise<string> {
        const keys = Object.keys(NATURES);
        const nature_name = NATURES[keys[Math.floor(Math.random() * keys.length)]];
        return nature_name;
    }

    /**
     * Determine if the pokemon is shiny or not
     * @returns boolean
     */
    async initShiny(): Promise<boolean> {
        let chance = 1 / 4096;
        return (Math.random() < chance)
    }
    
    /**
     * Initialise ivs of the pokemon
     * @returns ivs as object
     */
    async initIvs(): Promise<Record<string, number>> {
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
    private async getBaseStats(
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
export async function SpawningPokemon(guildId: string): Promise<void> {
    // Reset message_count
    message_count[guildId] = 0
    updateGuildLastSpawnDate(guildId)
    let pokemon = new Pokemon()
    await pokemon.initPokemon()
    console.log(pokemon)
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
    if (!isActive || !isDate) return false

    return true
}
