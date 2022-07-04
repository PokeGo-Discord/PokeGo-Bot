import mongoose from "mongoose";

export const connectDatabase = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Unable to connect to MongoDB Database.\nError: ' + err)
    })
}