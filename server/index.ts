import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors'
import router from './routes';
import { connectDB } from './database';
import { fetchAndStoreFloodData } from './services/fetchFloodData';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

//middleware
app.use(cors())
app.use(express.json())

//use routes 
app.use( router)


dotenv.config();

connectDB().then(() => {
  app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    try {
      await fetchAndStoreFloodData();  // Fetch and store the flood data after the server starts
      console.log('Flood data successfully fetched and stored!');
    } catch (error) {
      console.error('Error during flood data fetching and storing:', error);
    }
  });
});