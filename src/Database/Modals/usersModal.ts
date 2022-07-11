import { model, Schema } from 'mongoose'

export interface Users {
    userId: string,
    userName: string,
    userTag: string,
    numberPokemon: number,
    accountCreated_at: number,
    accountEdit_at: number,
}

export const Users = new Schema({
    userId: String,
    userName: String,
    userTag: String,
    numberPokemon: {type: Number, default: 0},
    accountCreated_at: {type: Date, default: Date.now()},
    accountEdit_at: {type: Date, default: Date.now()},
})

export default model<Users>('Users', Users)