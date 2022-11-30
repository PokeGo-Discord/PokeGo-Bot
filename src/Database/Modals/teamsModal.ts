import { model, Schema } from 'mongoose'
import { Pokemons } from './pokemonsModal'

export interface TeamsInterface {
    owner_id: string,
    pokemons_id: Array<string>

}

export const teamSchema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    pokemons_id: [{
        type: Schema.Types.ObjectId, ref: 'Pokemon'
    }]

})

export default model<TeamsInterface>('Teams', teamSchema)