import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/aqueous');
    console.log('Successful connection to the database')
  } catch (error) {
    console.log(`Connection was unsuccessful due to: ${error}`)
  }
};

connectDB();

export default mongoose