import { Client } from 'discord.js'
import { Document } from 'mongoose'
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

/**
 * Return pokemon of the users in a list
 * @param userId
 * @return array of pokemon name
 */
 export const getPokemonsUser = async (userId: string) => {
    const userData = await usersModal.findOne({ userId }).populate('pokemons')
    return userData;
}

export const getPokemonsNameUser = async(userId: string): Promise<Array<string>> => {
    const userData: Users = await getPokemonsUser(userId)
    const pokemonName: Array<string> = []
    userData.pokemons.forEach(pokemon => {
        pokemonName.push(pokemon.name)
    });
    return pokemonName
}