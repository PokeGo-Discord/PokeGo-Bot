import { model, Schema } from 'mongoose'
import { Pokemons } from './pokemonsModal'

export interface Users {
    userId: string,
    userName: string,
    pokemons: Array<Pokemons>,
    numberPokemon: number,
    accountCreated_at: number,
    accountEdit_at: number,
}

export const userSchema = new Schema({
    userId: String,
    userName: String,
    pokemons: [{
        type: Schema.Types.ObjectId, ref: 'Pokemon'
    }],
    numberPokemon: {type: Number, default: 0},
    accountCreated_at: {type: Date, default: Date.now()},
    accountEdit_at: {type: Date, default: Date.now()},
})

export default model<Users>('User', userSchema)