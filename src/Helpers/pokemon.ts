import { isSpawnDate, isGuildActive } from "./utils";
import { message_count } from "../Events/Client/messageCreate";
import { updateGuildLastSpawnDate } from "../Database/UtilsModals/UtilsGuilds";

/**
 * Spawn a pokemon to the guild.
 * @param guildId 
 */
export function SpawningPokemon(guildId: string): void {
    // Reset message_count
    message_count[guildId] = 0;
    updateGuildLastSpawnDate(guildId);
    console.log("Pokemon has spawn !");
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