import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import MessageForm from './components/MessageForm';
import ConnectionStatus from './components/ConnectionStatus';

function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const wsRef = useRef(null);
  const disconnectedManually = useRef(false);

  const connectToWebSocket = () => {
    try {
      const ws = new WebSocket('wss://echo.websocket.events');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        setIsConnecting(false);
        console.log(' Connected to WebSocket server');
        sendMessage('Hello');
      };

      ws.onmessage = (event) => {
        if (event.data.includes('echo.websocket.events sponsored by Lob.com')) return;

        const newMessage = {
          id: Date.now(),
          text: event.data,
          isIncoming: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
      };

      ws.onclose = () => {
        console.log(' WebSocket connection closed');
        setIsConnected(false);
        setMessages([]);
      };

      return ws;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setConnectionError('Failed to initialize WebSocket');
      return null;
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Disconnecting WebSocket due to tab change or close...');
      disconnectedManually.current = true;
      wsRef.current.close();
      setMessages([]);
    }
  };

  useEffect(() => {
    const ws = connectToWebSocket();
    if (!ws) return;

    const handleBeforeUnload = (event) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        disconnectWebSocket();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        disconnectWebSocket();
      } else if (document.visibilityState === 'visible') {
        if (disconnectedManually.current) {
          console.log('Skipping reconnection. Please refresh to reconnect.');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (ws) ws.close();
    };
  }, []);

  const sendMessage = (text) => {
    if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const newMessage = {
      id: Date.now(),
      text,
      isIncoming: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    wsRef.current.send(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4">
      <ConnectionStatus 
          isConnected={isConnected} 
          isConnecting={isConnecting} 
          disconnectedManually={disconnectedManually} 
        />
        <ChatBox messages={messages} />
        <MessageForm sendMessage={sendMessage} isConnected={isConnected} />
      </div>
    </div>
  );
}

export default App;
