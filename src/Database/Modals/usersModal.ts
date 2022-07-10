import { model, Schema } from 'mongoose'

export interface Users {
    userId: string,
    userName: string,
    userTag: string,
    numberPokemon: number,
    accountCreated_at: Date,
    accountEdit_at: Date,
}

export const Users = new Schema({
    userId: String,
    userName: String,
    userTag: String,
    numberPokemon: Number,
    accountCreated_at: Date,
    accountEdit_at: Date,
})

export default model<Users>('Users', Users)