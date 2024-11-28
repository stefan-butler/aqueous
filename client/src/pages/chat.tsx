import { useEffect, useState } from 'react';
import axios from 'axios';
import { IMessage } from '../types/chat-types';
import { useAppSelector } from '../redux/hooks';

function Chat () {
  const [messages, setMessages] = useState<[IMessage] | null>(null);
  const [chatId, setChatId] = useState('67483dc97daa00534b8f720c'); // use mock for building purposes 
  const [newMessage, setNewMessage] = useState('');
  const senderId = useAppSelector((state) => state.auth.user?.id);
  const [isAuthorised, setIsAuthorised] = useState(false);


  async function fetchMessages(chatId: string) {
    if (!chatId) return; // Ensure chatId exists
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function handleSend() {
    if (!newMessage.trim()) return; // prevent sending empty messages
  
    try {
      const response = await axios.post(`http://localhost:3000/api/chat/${chatId}/messages`, {
        senderId, 
        text: newMessage,
      });
  
      setMessages((prevMessages) => (prevMessages ? [...prevMessages, response.data] : [response.data]));
      setNewMessage(''); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  useEffect(() => {
    async function initialiseChat() {
      if (!chatId || !senderId) return; 
      try {
        // check authorisation 
        const response = await axios.get(`http://localhost:3000/api/chat/${chatId}`);
        const chat = response.data;
  
        if (chat.reporterId === senderId || chat.responderId === senderId) {
          setIsAuthorised(true);
          await fetchMessages(chatId); 
        } else {
          setIsAuthorised(false);
          alert('You are not authorized to participate in this chat.');
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }
    initialiseChat();
  }, [chatId, senderId]);

  return (
    <div className='bg-dark h-screen p-2'>
      <div className='bg-light m-auto w-[800px] h-[800px] p-4 rounded-lg shadow-2xl-neutral-100'>
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
          className='m-2 p-2 w-[150px] bg-gray-100 rounded-sm'
        />
        <button 
          onClick={handleSend}
          className='bg-dark hover:bg-gray-100 p-2 text-gray-100 hover:text-dark rounded-sm'
          >SEND</button>
      </div>
    </div>
  )
}

export default Chat;