import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Chat () {
  const [messages, setMessages] = useState<any | null>(null);


  async function fetchMessages() {
    const messages = await axios(`http://localhost:3000/api/chat/${chatId}/messages}`);
    setMessages(messages);
  }

  // handle Send 
  function handleSend () {
    
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>CHAT</h1>
      {/* messages */}
      <div>
        EXAMPLE MESSAGE
      </div>
      <label htmlFor='message-input'></label>
      <input 
        type='text'
        id='message-input'
        placeholder='your message here...'
      />
      <button
      // onClick - post message
      >SEND</button>
    </div>
  )
}