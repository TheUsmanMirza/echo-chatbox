import React, { useEffect, useRef } from 'react';
import Message from './Message';

const ChatBox = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 my-4 bg-gray-800 rounded-lg shadow-inner">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Send a message to start chatting</p>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <Message 
              key={message.id} 
              text={message.text} 
              isIncoming={message.isIncoming} 
              timestamp={message.timestamp} 
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatBox;