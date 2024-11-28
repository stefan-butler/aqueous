import { useEffect, useState } from 'react';
import axios from 'axios';
import { IMessage } from '../types/chat-types';
import { useAppSelector } from '../redux/hooks';

function Chat () {
  const [messages, setMessages] = useState<[IMessage] | null>(null);
  const [chatId, setChatId] = useState('mock-chat-id'); // use mock for building purposes 
  const [responderId] = useState('mock-responder-id'); // use mock for building purposes 
  const [reporterId] = useState('mock-reporter-id');  // use mock for building purposes 
  const [newMessage, setNewMessage] = useState('');
  // incidentId

  const sampleMessages = [
    {
      _id: "637a15f1a3e744001234abcd",
      chatId: "637a15f1a3e744001234abca",
      senderId: "637a15f1a3e744001234abcb",
      text: "Hey, how are you doing?",
      createdAt: "2024-11-27T10:00:00.000Z",
      updatedAt: "2024-11-27T10:00:00.000Z",
    },
    {
      _id: "637a15f1a3e744001234abce",
      chatId: "637a15f1a3e744001234abca",
      senderId: "637a15f1a3e744001234abcd",
      text: "I'm doing well, thanks! How about you?",
      createdAt: "2024-11-27T10:01:00.000Z",
      updatedAt: "2024-11-27T10:01:00.000Z",
    },
    {
      _id: "637a15f1a3e744001234abcf",
      chatId: "637a15f1a3e744001234abca",
      senderId: "637a15f1a3e744001234abcb",
      text: "Pretty good, just working on a project.",
      createdAt: "2024-11-27T10:02:00.000Z",
      updatedAt: "2024-11-27T10:02:00.000Z",
    },
    {
      _id: "637a15f1a3e744001234abd0",
      chatId: "637a15f1a3e744001234abcd",
      senderId: "637a15f1a3e744001234abcd",
      text: "Nice! Let me know if you need help.",
      createdAt: "2024-11-27T10:03:00.000Z",
      updatedAt: "2024-11-27T10:03:00.000Z",
    },
    {
      _id: "637a15f1a3e744001234abd1",
      chatId: "637a15f1a3e744001234abca",
      senderId: "637a15f1a3e744001234abcb",
      text: "Will do, thanks!",
      createdAt: "2024-11-27T10:04:00.000Z",
      updatedAt: "2024-11-27T10:04:00.000Z",
    },
  ];
  


  async function fetchMessages(chatId: string) {
    try {
      const messages = await axios(`http://localhost:3000/api/chat/${chatId}/messages`);
      setMessages(messages.data);
    }
    catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function handleSend() {
    if (!newMessage.trim()) return; // prevent sending empty messages
  
    try {
      const response = await axios.post(`http://localhost:3000/api/chat/${chatId}/messages`, {
        senderId: 'mock-sender-id', // for building purposes
        text: newMessage,
      });
  
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage(''); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  useEffect(() => {
    if(chatId) fetchMessages(chatId);
  }, [chatId]);

  return (
    <div>
      <h1>CHAT</h1>
      {sampleMessages.map((message: IMessage) => (
        <div key={message._id}>{message.text}</div>
      ))}
      
      <label htmlFor='message-input'></label>
      <input 
        type='text'
        id='message-input'
        placeholder='your message here...'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSend}>SEND</button>
    </div>
  )
}

export default Chat;