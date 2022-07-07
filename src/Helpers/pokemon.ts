import { isSpawnDate, isGuildActive } from "./utils";
import { message_count } from "../Events/Client/messageCreate";
import { updateGuildLastSpawnDate } from "../Database/UtilsModals/UtilsGuilds";
import fetch from 'node-fetch';
import { stat } from "fs";

export interface StatsInterface {
    
}

export class Pokemon {
    owner_id: string;
    owner_name: string
    name: string;
    level: number;
    nature: string;
    ivs: Record<string, number>
    stats: Record<string, number>
    shiny: boolean;

    async initPokemon() {
        this.name = 'clefairy';
        this.level = 50

        await this.initIv().then((res) => {
            this.ivs = res ;
        });

        await this.getBaseStats(this.name).then(async (baseStats: Record<string, number>) => {
            await this.initStats(baseStats).then((stats) => {
                this.stats = stats;
            })
        });
    }

    async initIv() {
        let ivs: Record<string, number> = {}
        ivs['hp'] = 5;
        ivs['atk'] = 5;
        ivs['def'] = 5;
        ivs['satk'] = 5;
        ivs['sdef'] = 5;
        ivs['spd'] = 5;
        
        return ivs;
    }

    async initStats(baseStats: Record<string, number>) {
        let stats: Record<string, number> = {}
        stats['hp'] = this.calc_stat(baseStats, 'hp')
        stats['atk'] = this.calc_stat(baseStats, 'atk')
        stats['def'] = this.calc_stat(baseStats, 'def')
        stats['satk'] = this.calc_stat(baseStats, 'satk')
        stats['sdef'] = this.calc_stat(baseStats, 'sdef')
        stats['spd'] = this.calc_stat(baseStats, 'spd')

        return stats
    }

    async getBaseStats(pokemonName: string) {
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
            baseStats['hp'] = +(JSON.stringify(result['stats'][0]['base_stat']))
            baseStats['atk'] = +(JSON.stringify(result['stats'][1]['base_stat']))
            baseStats['def'] = +(JSON.stringify(result['stats'][2]['base_stat']))
            baseStats['satk'] = +(JSON.stringify(result['stats'][3]['base_stat']))
            baseStats['sdef'] = +(JSON.stringify(result['stats'][4]['base_stat']))
            baseStats['spd'] = +(JSON.stringify(result['stats'][5]['base_stat']))
        
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

    calc_stat(baseStats: Record<string, number>, key: string) {
        console.log(key);
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