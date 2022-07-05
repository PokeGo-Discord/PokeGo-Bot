import { isSpawnDate, isGuildActive } from "./utils";

export function SpawningPokemon(): void {
    //console.log("Pokemon has spawn !");
}

/**
 * Return true if a pokemon can spawn, or false if a pokemon can't spawn.
 * @param guildId 
 * @returns boolean
 */
export async function isSpawnable(guildId: string): Promise<boolean> {
    if(!isSpawnDate || !isGuildActive)
        return false
        
    return true;
}