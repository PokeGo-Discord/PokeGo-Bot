import mongoose, { Model, model, models, mongo } from 'mongoose'
import usersModal from '../Database/Modals/usersModal'

/**
 * Database connection
 */
export const connectDatabase = async (): Promise<void> => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((err) => {
            console.error(
                'Unable to connect to MongoDB Database.\nError: ' + err
            )
        })
}

/**
 * Insert data to all document of a given collection
 * USE THIS ONLY AFTER UPDATE THE SCHEMA
 * @param modelName
 * @param obj
 */
export const insertDataInExistingDoc = async (
    modelName: string,
    obj: object
): Promise<void> => {
    const collection = mongoose.connection.db.collection(modelName)
    collection.updateMany({}, { $set: obj })
}

/**
 * delete key to all document of a given collection
 * USE THIS ONLY AFTER UPDATE THE SCHEMA
 * @param modelName
 * @param keyToRemove Example: { toRemove: "" }
 */
export const deleteDataInExistingDoc = async (
    modelName: string,
    obj: object
): Promise<void> => {
    const collection = mongoose.connection.db.collection(modelName)
    collection.updateMany({}, { $unset: obj })
}

/**
 * Edit key to all document of a given collection
 * USE THIS ONLY AFTER UPDATE THE SCHEMA
 * @param modelName
 * @param obj  Example: {"old": "new"}
 */
export const updateKeyInExistingDoc = async (
    modelName: string,
    obj: Record<string, string>
): Promise<void> => {
    const collection = mongoose.connection.db.collection(modelName)
    collection.updateMany({}, { $rename: obj })
}

export const purgeAllDoc = async (excludeModelName = undefined) => {
    const collection = mongoose.connection.db.listCollections()
    var modelsName = mongoose.modelNames()
    var filteredArray = modelsName.filter(function(e) { return e !== excludeModelName })
    console.log(filteredArray)

    filteredArray.forEach(modelName => {
        mongoose.model(modelName).deleteMany({}, function(err) {
            if (err) {
                console.log(err)
            } 
        })
    });    
}

