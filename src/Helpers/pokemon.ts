import { isSpawnDate, isGuildActive } from "./utils";
import { message_count } from "../Events/Client/messageCreate";
import { updateGuildLastSpawnDate } from "../Database/UtilsModals/UtilsGuilds";
import { STATS_NAME } from "./constants";
import fetch from "node-fetch";

/**
 * Class Pokemon
 */
export class Pokemon {
    owner_id: string;
    owner_name: string
    name: string;
    level: number;
    nature: string;
    ivs: Record<string, number>
    stats: Record<string, number>
    shiny: boolean;

    /**
     * Init the pokemon, generate ivs / Stats / name / level and everything that needed for a pokemon
     */
    async initPokemon(): Promise<void> {
        this.name = 'clefairy';
        this.level = 50

        await this.initIvs().then((res) => {
            this.ivs = res ;
        });

        await this.getBaseStats(this.name).then(async (baseStats: Record<string, number>) => {
            await this.updateStats(baseStats).then((stats) => {
                this.stats = stats;
            })
        });
    }

    /**
     * Initialise ivs of the pokemon
     * @returns ivs as object
     */
    async initIvs(): Promise<Record<string,number>> {
        let ivs: Record<string, number> = {}
        for(let i = 0; i < STATS_NAME.length; i++)
          ivs[STATS_NAME[i]] = 5;
        
        return ivs;
    }

    /**
     * Update stats of the pokemon
     * @param baseStats 
     * @returns stats object
     */
    async updateStats(baseStats: Record<string, number>): Promise<Record<string, number>> {
        let stats: Record<string, number> = {}
        for(let i = 0; i < STATS_NAME.length; i++)
          stats[STATS_NAME[i]] = this.calc_stat(baseStats, STATS_NAME[i])

        return stats
    }

    /**
     * TODO: Stop fetching base stats with api and use constants that store all basestats of a pokemon
     * Get base stats of a pokemon by his name
     * @param pokemonName 
     * @returns object
     */
    private async getBaseStats(pokemonName: string): Promise<string | Record<string, number>> {
        try {
            // 👇️ const response: Response
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
            });
        
            if (!response.ok) {
              throw new Error(`Error! status: ${response.status}`);
            }
        
            // 👇️ const result: GetUsersResponse
            const result = await response.json();
            
            let baseStats: Record<string, number> = {}
            for(let i = 0; i < STATS_NAME.length; i++)
              baseStats[STATS_NAME[i]] = +(JSON.stringify(result['stats'][i]['base_stat']))
        
            return baseStats;
          } catch (error) {
            if (error instanceof Error) {
              console.log('error message: ', error.message);
              return error.message;
            } else {
              console.log('unexpected error: ', error);
              return 'An unexpected error occurred';
            }
          }
    }

    /**
     * Calcule les stats du pokemon
     * @param baseStats 
     * @param key ex: 'atk'
     * @returns number
     */
    private calc_stat(baseStats: Record<string, number>, key: string): number {
        return Math.floor(
            (((this.ivs[key] + 2 * baseStats[key]) * this.level / 100) + 5)
        )
    }

}

/**
 * Spawn a pokemon to the guild.
 * @param guildId 
 */
export async function SpawningPokemon(guildId: string): Promise<void> {
    // Reset message_count
    message_count[guildId] = 0;
    updateGuildLastSpawnDate(guildId);
    let pokemon = new Pokemon();
    await pokemon.initPokemon();
    console.log(pokemon);
}

/**
 * Return true if a pokemon can spawn, or false if a pokemon can't spawn.
 * @param guildId 
 * @returns boolean
 */
export async function isSpawnable(guildId: string): Promise<boolean> {
    let isActive = await isGuildActive(guildId);
    let isDate = await isSpawnDate(guildId);
    console.log(isActive + " " + isDate);
    if(!isActive || !isDate)
        return false
        
    return true;
}