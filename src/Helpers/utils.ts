import { Guild, Message } from "discord.js";
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