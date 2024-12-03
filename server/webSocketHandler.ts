import { Server } from 'socket.io';
import Message from './models/message';

export function webSocketHandler(io: Server): void {
  io.on('connection', (socket) => {
    console.log('A user connected');

    //listen for chat messages 
    socket.on('chat message', async (data) => {
      const { senderId, chatId, text } = data;

      console.log('Message received', data);

      // Save to the database
      const message = new Message({
        senderId,
        chatId,
        text,
        createdAt: new Date(),
      });
      await message.save();

      //broadcast message to all connected clients 
      io.emit('chat message', message);
    });

    //fetch old messages when user joins the chat 
    socket.on('join', async (room) => {
      console.log(`User joined ${room}`);

      //fetch recent messages
      const recentMessages = await Message.find({ chatId: room })
          .sort({ timestamp: -1 })
          .limit(50)
          .exec();

      //send the message to the user
      socket.emit('chat history', recentMessages)    
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    })
  })
}