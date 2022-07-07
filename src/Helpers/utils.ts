import { Guild } from 'discord.js'
import {
    getGuildLastMessageDate,
    getGuildLastSpawnDate,
} from '../Database/UtilsModals/UtilsGuilds'
import { message_count } from '../Events/Client/messageCreate'
import { Config } from '../Typings/config'
const config: Config = require('../config.json')

// TODO: make config variable configurable per each guild (DATABASE)

/**
 * Return an Array of Guild
 * @param client
 * @returns Array of Guild
 */
export function fetchAllGuild(client): Array<Guild> {
    const Guilds: Array<Guild> = client.guilds.cache.map((guild) => guild)
    return Guilds
}

/**
 * Detect if an user is spamming.
 * @param currentTime
 * @param cooldown_users
 * @param message
 * @returns boolean
 */
export function isSpamming(
    currentTime: number,
    cooldown_users: Record<string, number>,
    authorId: string
): boolean {
    if (
        currentTime -
            (cooldown_users[authorId] ? cooldown_users[authorId] : 0) <
        config.spamTimeThreshold * 1000
    ) {
        return true
    }

    updateCooldownUser(currentTime, cooldown_users, authorId)
    return false
}

/**
 * Update the time of an user in the cooldown_user Record.
 * @param currentTime
 * @param cooldown_users
 * @param message
 * @returns Record of string, number
 */
export function updateCooldownUser(
    currentTime: number,
    cooldown_users: Record<string, number>,
    authorId: string
): Record<string, number> {
    cooldown_users[authorId] = currentTime
    return cooldown_users
}

/**
 * Detecte if the guild is active
 * @param guildId
 * @returns boolean
 */
export async function isGuildActive(guildId: string): Promise<boolean> {
    let lastMessageDate = await getGuildLastMessageDate(guildId)
    let actualDate: number = Date.now()

    if (
        actualDate - lastMessageDate > config.timeBetweenMessage * 60000 &&
        message_count[guildId] >= config.messageCountNeeded
    ) {
        // 2min
        message_count[guildId] = 0
    }

    if (message_count[guildId] >= config.messageCountNeeded) return true
    return false
}

/**
 * Detect is the last spawn date is to far of the actual date.
 * @param guildId
 * @returns Promise boolean
 */
export async function isSpawnDate(guildId: string): Promise<boolean> {
    let actualDate: number = Date.now()
    let LastSpawnDate: number = await getGuildLastSpawnDate(guildId)
    if (actualDate - LastSpawnDate < config.timeBetweenSpawn * 60000)
        // 10min
        return false
    return true
}

/**
 * Sen a console.log only when the debug environment is ON
 * @param log
 */
export function DebugLog(log: string): void {
    if (process.env.environment === 'debug') console.log('DEBUG: ' + log + '\n')
}
