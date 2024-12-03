import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors'
import router from './routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './database';
import { fetchAndStoreFloodData } from './services/fetchFloodData';
import warningRoutes from './routes/warningRoutes';
import incidentRoutes from './routes/incidentRoutes';
import chatRoutes from './routes/chatRoutes';
import { webSocketHandler } from './webSocketHandler';

const app = express();
const port: number = 3000;

//webSocket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

webSocketHandler(io);

//middleware
app.use(cors())
app.use(express.json())

//use routes 
app.use( router)
app.use("/api", warningRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/chat", chatRoutes);


dotenv.config();

connectDB().then(() => {
  server.listen(port, async () => {
    console.log(`Server listening on port ${port}`)
    try {
      await fetchAndStoreFloodData();  // Fetch and store the flood data after the server starts
      console.log('Flood data successfully fetched and stored!');
    } catch (error) {
      console.error('Error during flood data fetching and storing:', error);
    }
  });
});