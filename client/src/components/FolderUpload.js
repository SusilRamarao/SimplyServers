import React, { useState, useRef } from 'react';
import './FolderUpload.css';

const FolderUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList) => {
    const fileData = fileList.map(file => ({
      name: file.name,
      path: file.webkitRelativePath || file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: new Date(file.lastModified).toLocaleString()
    }));
    
    setFiles(fileData);
    
    // Send folder structure to server
    sendFilesToServer(fileData);
  };

  const sendFilesToServer = async (fileData) => {
    setIsUploading(true);
    try {
      const response = await fetch('http://localhost:3000/get-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: fileData }),
      });
      
      if (response.ok) {
        console.log('Files sent successfully');
      } else {
        console.error('Failed to send files');
      }
    } catch (error) {
      console.error('Error sending files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const openFolderDialog = () => {
    fileInputRef.current.click();
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="folder-upload">
      <div className="upload-header">
        <h2>Folder Upload</h2>
        {files.length > 0 && (
          <button onClick={clearFiles} className="clear-button">
            Clear Files
          </button>
        )}
      </div>
      
      <div
        className={`drop-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-content">
          <div className="drop-icon">📁</div>
          <p>Drag & Drop your folder here</p>
          <span>or</span>
          <button onClick={openFolderDialog} className="browse-button">
            Browse Folder
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      {isUploading && (
        <div className="uploading-indicator">
          <div className="spinner"></div>
          <span>Processing files...</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          <h3>Files ({files.length})</h3>
          <div className="file-list-container">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-path">{file.path}</div>
                </div>
                <div className="file-meta">
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="file-date">{file.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderUpload;
