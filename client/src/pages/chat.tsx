import { useEffect, useState } from 'react';
import axios from 'axios';
import { IMessage } from '../types/chat-types';
import { useAppSelector } from '../redux/hooks';

function Chat () {
  const [messages, setMessages] = useState<[IMessage] | null>(null);
  const [chatId, setChatId] = useState('67483dc97daa00534b8f720c'); // use mock for building purposes 
  const [newMessage, setNewMessage] = useState('');
  


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
        senderId: '67464815c0f96739a99fd6e6', 
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
    <div className='bg-dark h-screen'>
      <h1 className='text-gray-100'>CHAT</h1>
      {messages ? messages.map((message: IMessage) => (
        <div className='text-gray-100 p-2 bg-lighter w-[200px] my-2 rounded-sm shadow-neutral-100 mx-2' key={message._id}>{message.text}</div>
      )):
      <div>NO MESSAGES YET</div>
      }
      
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