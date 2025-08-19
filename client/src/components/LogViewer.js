import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './LogViewer.css';

const LogViewer = () => {
  const [logs, setLogs] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const logsRef = useRef(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketRef.current.on('log', (message) => {
      setLogs(prevLogs => prevLogs + message + '\n');
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs('');
  };

  return (
    <div className="log-viewer">
      <div className="log-header">
        <h2>Live Command Logs</h2>
        <div className="log-controls">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '● Disconnected'}
          </div>
          <button onClick={clearLogs} className="clear-button">
            Clear Logs
          </button>
        </div>
      </div>
      <div ref={logsRef} className="logs-container">
        <pre>{logs || 'Waiting for logs...'}</pre>
      </div>
    </div>
  );
};

export default LogViewer;
