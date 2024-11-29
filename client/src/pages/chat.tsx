import { useEffect, useState } from 'react';
import axios from 'axios';
import { IMessage } from '../types/chat-types';
import { useAppSelector } from '../redux/hooks';
import { useLocation } from 'react-router';

function Chat () {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isAuthorised, setIsAuthorised] = useState(true);
  const senderId = useAppSelector((state) => state.auth.user?.id);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatId = queryParams.get('chatId');

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token is missing');

      const response = await axios.post(
        `http://localhost:3000/api/chat/${chatId}/messages`,
        { senderId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => (prev ? [...prev, response.data] : [response.data]));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const initialiseChat = async () => {
      if (!chatId || !senderId) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token is missing');

        const response = await axios.get(`http://localhost:3000/api/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chat = response.data || {};
        setMessages(chat || []);

        // if (chat.reporterId === senderId || chat.responderId === senderId) {
        //   setIsAuthorised(true);
        // } else {
        //   setIsAuthorised(false);
        // }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsAuthorised(false);
      }
    };

    initialiseChat();
  }, [chatId, senderId]);
  return (
    <div className="bg-dark h-screen p-2">
      {!isAuthorised ? (
        <h1 className="text-gray-100">You are not authorized to participate in this chat.</h1>
      ) : (
        <div className="bg-light m-auto w-[800px] h-[800px] p-4 rounded-lg shadow-2xl-neutral-100">
          <h1 className="text-gray-100">CHAT</h1>
          {messages === null ? (
            <div className="text-gray-100">Loading...</div>
          ) : messages.length > 0 ? (
            messages.map((message: IMessage) => (
              <div
                className="text-gray-100 p-2 bg-lighter w-[200px] my-2 rounded-sm shadow-neutral-100 mx-2"
                key={message._id}
              >
                {message.text}
              </div>
            ))
          ) : (
            <div className="text-gray-100">NO MESSAGES YET</div>
          )}
          <label htmlFor="message-input"></label>
          <input
            type="text"
            id="message-input"
            placeholder="your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="m-2 p-2 w-[150px] bg-gray-100 rounded-sm"
          />
          <button
            onClick={handleSend}
            className="bg-dark hover:bg-gray-100 p-2 text-gray-100 hover:text-dark rounded-sm"
          >
            SEND
          </button>
        </div>
      )}
    </div>
  )};

export default Chat;