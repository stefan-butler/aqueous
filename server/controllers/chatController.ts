import { Request, Response} from 'express';
import Chat from '../models/chat';
import Message from '../models/message';

const chatController = {

  // get all messages for responder 
  getAllChats: async (req: Request, res: Response) => {
    try {
      const chats = await Chat.find({ responderId: req.params.responderId })
          .populate('reporterId', 'name')
          .populate('incidentId', 'title');
      res.status(200).json(chats);  
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error(error);  
    }
  },

  // create a new chat for an incident 
  createChat: async (req: Request, res: Response) => {
    try {
      const { incidentId, responderId, reporterId } = req.body;
      const chat = await Chat.create({ incidentId, responderId, reporterId });
      console.log('Created Chat:', chat);
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error(error);
    }
  },

  // get messages for a chat 
  getMessages: async (req: Request, res: Response) => {
    try {
      const messages = await Message.find({ chatId: req.params.chatId });
      console.log('Chat ID from request params:', req.params.chatId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  // send a message
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { senderId, text } = req.body;
      const message = await Message.create({ chatId: req.params.chatId, senderId, text });
      res.status(201).json(message);  
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error(error);
    }
  },

  // check if chat exists
  checkChatExists: async (req: Request, res: Response): Promise<void> => {
    try {
      const { incidentId } = req.query;
  
      if (!incidentId) {
        res.status(400).json({ message: 'Incident ID is required.' });
        return;
      }
  
      const chat = await Chat.findOne({ incidentId });
  
      if (!chat) {
        res.status(404).json({ message: 'Chat not found for the given incident.' });
        return;
      }
  
      res.status(200).json(chat);
    } catch (error) {
      console.error('Error checking chat existence:', error);
      res.status(500).json({ message: (error as Error).message });
    }
  },
}

export default chatController;