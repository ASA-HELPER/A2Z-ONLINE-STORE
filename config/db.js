import mongoose from 'mongoose'
import colors from 'colors'
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB database ${conn.connection.host}`.bgYellow.white)
    }
    catch (error) {
        console.log(`Error in mongodb ${error}`.bgRed.white)
    }
}
export default connectDB;