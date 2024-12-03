import { useEffect, useState } from 'react';
import axios from 'axios';
import { IMessage } from '../types/chat-types';
import { useAppSelector } from '../redux/hooks';
import { useLocation } from 'react-router';
import { io, Socket } from 'socket.io-client';

function Chat() {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isAuthorised, setIsAuthorised] = useState(true);
  const senderId = useAppSelector((state) => state.auth.user?.id);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatId = queryParams.get('chatId');
  const [socket, setSocket] = useState<Socket | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !socket || !chatId) return;

    //emit the new message to the server
    socket.emit('chat message', {
      senderId,
      chatId,
      text: newMessage,
    });
    
    setNewMessage('');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token || !chatId || !senderId) {
      setIsAuthorised(false);
      return;
    }

    //initialise socket connection
    const socketInstance = io('http://localhost:3000', {
      query: { chatId },
      auth: { token }, 
    });

    setSocket(socketInstance);

      // Listen for incoming messages
    const handleMessage = (message: IMessage) => {
      console.log('Received message:', message);
      setMessages((prev) => [...prev, message]);
    };

    socketInstance.on('chat message', handleMessage);

    //fetch old messages using http 
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setIsAuthorised(false);
      }
    };

    fetchChatHistory();

    return () => {
      // cleanup connection on unmount 
      socketInstance.off('chat message')
      socketInstance.disconnect();
    }

  }, [chatId, senderId]);

  return (
    <div className="bg-dark h-screen p-2 flex flex-col">
      {!isAuthorised ? (
        <h1 className="text-gray-100">You are not authorized to participate in this chat.</h1>
      ) : (
        <div className="bg-light m-auto w-[800px] h-[800px] p-4 rounded-lg shadow-2xl-neutral-100 flex flex-col">
          <h1 className="text-gray-100 font-bold text-center mb-4">INCIDENT CHAT</h1>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto mb-4 p-2 space-y-2">
            {messages === null ? (
              <div className="text-gray-100">Loading...</div>
            ) : messages.length > 0 ? (
              messages.map((message: IMessage) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderId === senderId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shadow-md max-w-xs ${
                      message.senderId === senderId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-300 text-right mt-1">
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-100">NO MESSAGES YET</div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center bg-gray-300 p-2 rounded-lg sticky bottom-0">
            <input
              type="text"
              id="message-input"
              placeholder="Your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 bg-white rounded-lg mr-2"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;