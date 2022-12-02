import { model, Schema } from 'mongoose'
import { Pokemon } from '../../Helpers/pokemon'

export interface Pokemons {
    owner_id: string
    pokemonId: number
    name: string
    level: number
    nature: string
    ivs: Object
    stats: Object
    shiny: boolean
}

export const pokemonSchema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    pokemonId: Number,
    name: String,
    level: Number,
    nature: String,
    ivs: Object,
    stats: Object,
    shiny: Boolean,
})


export default model<Pokemons>('Pokemon', pokemonSchema)