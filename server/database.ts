import mongoose from "mongoose";

(async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/aqueous');
    console.log('Successful connection to the database')
  } catch (error) {
    console.log(`Connection was unsuccessful due to: ${error}`)
  }
})();

export default mongoose