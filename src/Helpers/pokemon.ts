import { isSpawnDate, isGuildActive } from "./utils";
import { message_count } from "../Events/Client/messageCreate";

export function SpawningPokemon(guildId: string): void {
    message_count[guildId] = 0;
    console.log("Pokemon has spawn !");
}

/**
 * Return true if a pokemon can spawn, or false if a pokemon can't spawn.
 * @param guildId 
 * @returns boolean
 */
export async function isSpawnable(guildId: string): Promise<boolean> {
    // TODO: Rajouter !isSpawnDate dans le if
    let bool = await isGuildActive(guildId);
    console.log("bool: " + bool);
    if(!bool)
        return false
        
    return true;
}