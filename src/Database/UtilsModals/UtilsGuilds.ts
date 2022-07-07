import { Client } from 'discord.js'
import guildsModal, { Guilds } from '../Modals/guildsModal'
import { DebugLog } from '../../Helpers/utils'

/**
 * Check if a guild exist by the guild ID
 * @param guildId
 * @returns returns a boolean as promise
 */
export const isGuildExist = async (guildId: string): Promise<boolean> => {
    const guildData = await guildsModal.findOne({ guildId })

    if (guildData == null) return false

    return true
}

/**
 * Create a guild by the guild ID
 * @param guildId
 */
export const createGuildData = async (guildId: string): Promise<void> => {
    const guildData = await guildsModal.create({
        guildId: guildId,
        lastSpawnDate: Date.now(),
        lastMessageDate: Date.now(),
    })
    guildData.save()
    DebugLog('✅ a guilds have been added')
}

/**
 * Delete a guild by the guild ID
 * @param guildId
 */
export const deleteGuildData = async (guildId: string): Promise<void> => {
    const guildData = await guildsModal.findOne({ guildId })

    if (!guildData) return

    guildData.deleteOne()
    DebugLog('❌ a guilds have been deleted')
}

/**
 * Return all data of a guild by the guild ID
 * @param guildId
 * @returns returns a Guilds as promise
 */
export const getGuildData = async (guildId: string): Promise<Guilds> => {
    const guildData = await guildsModal.findOne({ guildId })
    return guildData
}

/**
 * Return the last spawn date by the guild ID
 * @param guildId
 * @returns return a Date as promise
 */
export const getGuildLastSpawnDate = async (
    guildId: string
): Promise<number> => {
    const guildData = await guildsModal.findOne({ guildId })
    return guildData.lastSpawnDate
}

/**
 * Update the lastSpawnDate by the guild ID
 * @param guildId
 */
export const updateGuildLastSpawnDate = async (
    guildId: string
): Promise<void> => {
    const guildData = await guildsModal.findOne({ guildId })
    guildData.lastSpawnDate = Date.now()
    guildData.save()
}

/**
 *  Return the last message date by the guild Id
 * @param guildId
 * @returns
 */
export const getGuildLastMessageDate = async (
    guildId: string
): Promise<number> => {
    const guildData = await guildsModal.findOne({ guildId })
    return guildData.lastMessageDate
}

/**
 * Update the lastMessageDate by the guild Id
 * @param guildId
 */
export const updateGuildLastMessageDate = async (
    guildId: string
): Promise<void> => {
    const guildData = await guildsModal.findOne({ guildId })
    guildData.lastMessageDate = Date.now()
    guildData.save()
}

/**
 * Create all document for each guild that have been added when the bot was offline
 * @param guildId
 */
export const createGuildDataOfflined = async (
    client: Client
): Promise<void> => {
    const guildsClient: Array<string> = client.guilds.cache.map(
        (guild) => guild.id
    )
    const guildsMongo: Array<string> = await (
        await guildsModal.find({})
    ).map((guild) => guild.guildId)

    let inc: number = 0
    guildsClient.forEach((id) => {
        if (guildsMongo.includes(id)) return
        else {
            createGuildData(id)
            inc++
        }
    })
}

/**
 * Delete all document for each guild that have been remove when the bot was offline
 * @param guildId
 */
export const deleteGuildDataOfflined = async (
    client: Client
): Promise<void> => {
    const guildsClient: Array<string> = client.guilds.cache.map(
        (guild) => guild.id
    )
    const guildsMongo: Array<string> = await (
        await guildsModal.find({})
    ).map((guild) => guild.guildId)

    let inc: number = 0
    guildsMongo.forEach((id) => {
        if (guildsClient.includes(id)) return
        else {
            deleteGuildData(id)
            inc++
        }
    })
}
