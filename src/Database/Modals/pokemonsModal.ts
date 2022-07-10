import { model, Schema } from 'mongoose'
import { Pokemon } from '../../Helpers/pokemon'

export interface Pokemons {
    owner_id: string
    owner_name: string
    name: string
    level: number
    nature: string
    ivs: Object
    stats: Object
    shiny: boolean
}

export const Pokemons = new Schema({
    owner_id: String,
    owner_name: String,
    name: String,
    level: Number,
    nature: String,
    ivs: Object,
    stats: Object,
    shiny: Boolean,
})


export default model<Pokemons>('Pokemons', Pokemons)