import React from 'react';

const Message = ({ text, isIncoming, timestamp }) => {
  return (
    <div className={`flex mb-4 ${isIncoming ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isIncoming 
            ? 'bg-gray-700 text-white rounded-bl-none' 
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm break-words">{text}</p>
        <span className={`text-xs ${isIncoming ? 'text-gray-400' : 'text-blue-200'} block mt-1`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default Message;