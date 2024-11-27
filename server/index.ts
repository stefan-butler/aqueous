import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors'
import router from './routes';
import { connectDB } from './database';
import { fetchAndStoreFloodData } from './services/fetchFloodData';
import warningRoutes from './routes/warningRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
const port: number = 3000;

//middleware
app.use(cors())
app.use(express.json())

//use routes 
app.use( router)
app.use("/api", warningRoutes);
app.use("/api/chat", chatRoutes);


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