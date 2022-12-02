import { model, Schema } from 'mongoose'
import { Pokemon } from '../../Helpers/pokemon'
import { pokemonSchema } from './pokemonsModal'

export interface BoxsInterface {
    owner_id: string,
    pokemons_id: string[][]
}

export const boxSchema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    pokemons_id: [[{
        type: Schema.Types.ObjectId, ref: 'Pokemon'
    }]]
})

export default model<BoxsInterface>('Boxs', boxSchema)