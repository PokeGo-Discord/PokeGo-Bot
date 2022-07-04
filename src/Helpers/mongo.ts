import mongoose, { Model, model } from 'mongoose';
import { Interface } from 'readline';
import { TextEncoderStream } from 'stream/web';
import { Guilds } from '../Database/Modals/guildsModal';

/**
 * Database connection
 */
export const connectDatabase = async (): Promise<void> => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.error('Unable to connect to MongoDB Database.\nError: ' + err)
    })
}

/**
 * Insert data to all document of a given collection
 * USE THIS ONLY AFTER UPDATE THE SCHEMA
 * @param modelName 
 * @param obj  
 */
export const insertDataInExistingDoc = async (modelName: string, obj: object): Promise<void> => {
    const collection  = mongoose.connection.db.collection(modelName);
    collection.updateMany({ },{ $set: obj });
}
