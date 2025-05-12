import React from 'react';

const ConnectionStatus = ({ isConnected, isConnecting, disconnectedManually }) => {
  let message = '';
  let bgClass = '';

  if (isConnecting) {
    message = 'Connecting to WebSocket server...';
    bgClass = 'bg-blue-900 text-blue-200';
  } else if (!isConnected && disconnectedManually.current) {
    message = 'Connection is disconnected. Please refresh...';
    bgClass = 'bg-yellow-900 text-yellow-200';
  } else if (isConnected) {
    message = 'Connected to WebSocket server';
    bgClass = 'bg-green-900 text-green-200';
  }

  return (
    <div className={`text-center py-2 text-sm rounded ${bgClass}`}>
      {message}
    </div>
  );
};

export default ConnectionStatus;