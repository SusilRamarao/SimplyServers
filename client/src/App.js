import React, { useState } from 'react';
import './App.css';
import LogViewer from './components/LogViewer';
import FolderUpload from './components/FolderUpload';

function App() {
  const [currentView, setCurrentView] = useState('logs');

  return (
    <div className="App">
      <header className="App-header">
        <h1>SimplyServers</h1>
        <nav>
          <button 
            className={currentView === 'logs' ? 'active' : ''}
            onClick={() => setCurrentView('logs')}
          >
            Live Logs
          </button>
          <button 
            className={currentView === 'upload' ? 'active' : ''}
            onClick={() => setCurrentView('upload')}
          >
            Folder Upload
          </button>
        </nav>
      </header>
      <main>
        {currentView === 'logs' && <LogViewer />}
        {currentView === 'upload' && <FolderUpload />}
      </main>
    </div>
  );
}

export default App;
