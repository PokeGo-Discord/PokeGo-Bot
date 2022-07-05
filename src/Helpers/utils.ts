import { Guild } from "discord.js";
import { getGuildLastSpawnDate } from "../Database/UtilsModals/UtilsGuilds";
import { message_count } from "../Events/Client/messageCreate";

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
 * Detect if an user is spamming.
 * @param currentTime 
 * @param cooldown_users 
 * @param message 
 * @returns boolean
 */
export function isSpamming(currentTime: number, cooldown_users: Record<string, number>, authorId: string): boolean {
    if(currentTime - (cooldown_users[authorId] ? cooldown_users[authorId] : 0) < 1500) {
        console.log("SPAM");
        return true;
    }

    updateCooldownUser(currentTime, cooldown_users, authorId);
    return false;
}

/**
 * Update the time of an user in the cooldown_user Record.
 * @param currentTime 
 * @param cooldown_users 
 * @param message 
 * @returns Record of string, number
 */
export function updateCooldownUser(currentTime: number, cooldown_users: Record<string, number>, authorId: string): Record<string, number> {
    cooldown_users[authorId] = currentTime;
    return cooldown_users;
}

/**
 * Detecte if the guild is active
 * @param guildId 
 * @returns boolean
 */
export function isGuildActive(guildId: string): boolean {
    if(message_count[guildId] >= 8) return true
    return false;
}

/**
 * Detect is the last spawn date is to far of the actual date.
 * @param guildId 
 * @returns Promise boolean
 */
export async function isSpawnDate(guildId: string): Promise<boolean> {
    let actualDate: number = Date.now();
    let LastSpawnDate: number = await getGuildLastSpawnDate(guildId);
    if(actualDate - LastSpawnDate < 600000) // 10min
        return false;
    return true
}

/**
 * Sen a console.log only when the debug environment is ON
 * @param log 
 */
export function DebugLog(log: string): void {
    if(process.env.environment === 'debug')
        console.log("DEBUG: " + log + "\n")
}