import { Guild, Message } from "discord.js";

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
export function isSpamming(currentTime: number, cooldown_users: Record<string, number>, message: Message): boolean {
    if(currentTime - (cooldown_users[message.author.id] ? cooldown_users[message.author.id] : 0) < 1500) {
        console.log("SPAM");
        return true;
    }

    updateCooldownUser(currentTime, cooldown_users, message);
    return false;
}

/**
 * Update the time of an user in the cooldown_user Record.
 * @param currentTime 
 * @param cooldown_users 
 * @param message 
 * @returns Record of string, number
 */
export function updateCooldownUser(currentTime: number, cooldown_users: Record<string, number>, message: Message): Record<string, number> {
    cooldown_users[message.author.id] = currentTime;
    return cooldown_users;
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