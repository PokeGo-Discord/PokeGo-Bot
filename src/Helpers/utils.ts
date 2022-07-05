import { Guild } from "discord.js";

/**
 * Return an Array of Guild
 * @param client 
 * @returns Array of Guild
 */
export function fetchAllGuild(client): Array<Guild> {
    const Guilds: Array<Guild> = client.guilds.cache.map(guild => guild);
    return Guilds;
}

/**
 * Detecte if the guild is active
 * @param guildId 
 * @returns boolean
 */
export function isGuildActive(guildId: string): boolean {
    // TODO: Detecte if the guild is active or not then return true if is active, and false if is inactive.
    return true
}

/**
 * Detect is the last spawn date is to far of the actual date.
 * @param guildId 
 * @returns boolean
 */
export function isSpawnDate(guildId: string): boolean {
    // TODO: Detect is the last spawn date is to far of the actual date. Return true if is to far, or return false.
    return true
}

export function DebugLog(log: string): void {
    if(process.env.environment === 'debug')
        console.log("DEBUG: " + log + "\n")
}