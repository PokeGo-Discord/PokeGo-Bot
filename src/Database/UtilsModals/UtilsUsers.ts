import { Client } from 'discord.js'
import usersModal, { Users } from '../Modals/usersModal'

/**
 * Check if a user exist by the user ID
 * @param userId
 * @returns returns a boolean as promise
 */
 export const isUserExist = async (userId: string): Promise<boolean> => {
    const userData = await usersModal.findOne({ userId })

    if (userData === null) return false

    return true
}