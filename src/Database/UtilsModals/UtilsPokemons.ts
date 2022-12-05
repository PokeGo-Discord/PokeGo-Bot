import { readFileSync } from "fs";
import { getPathFile } from "../../Helpers/utils";
import pokemonsModal from "../Modals/pokemonsModal";

 export const getPokemonNameByMongoId = async (pokemonId: string) => {
    const pokemonName = await pokemonsModal.findOne({_id: pokemonId})
    return pokemonName.name;
}

export const getAllPathTeams = async (array) => {
    const allAsyncResults = []
  
    for (const pokemonId of array) {
        const pokemonName = await getPokemonNameByMongoId(pokemonId.toString())
        const path = getPathFile(pokemonName)
        allAsyncResults.push(path)
    }
  
    return allAsyncResults
}

export const loadPokemonImg = async (array, Canvas) => {
    const allAsyncResults = []
  
    for (const file of array) {
        const pokemonImg = await Canvas.loadImage(readFileSync(file));
        allAsyncResults.push(pokemonImg)
    }
  
    return allAsyncResults
}

