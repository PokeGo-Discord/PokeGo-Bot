import { Client } from 'discord.js'
import { Document, Types } from 'mongoose'
import usersModal, { Users } from '../Modals/usersModal'
import pokemonsModal from '../Modals/pokemonsModal'

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

export const getUserId = async (userId: string): Promise<string> => {
    const userData = await usersModal.findOne({ userId })

    return userData.id
}
 
/**
 * Return pokemon of the users in a list
 * @param userId
 * @return array of pokemon name
 */
 export const getPokemonsUser = async (userId: string) => {
    const userData = await usersModal.findOne({ userId })
    const pokemonData = await pokemonsModal.find({owner_id: userData._id})
    console.log(pokemonData)
    return pokemonData;
}

export const getOnlyNamePokemonsUser = async (userId: string): Promise<Array<string>> => {
    const userData = await usersModal.findOne({ userId })
    const pokemonData = await pokemonsModal.find({owner_id: userData._id}).select('name')
    const pokemonName: Array<string> = []
    pokemonData.forEach(pokemon => {
        pokemonName.push(pokemon.name)
    });
    return pokemonName;
}
