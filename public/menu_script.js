const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('folder-input');
const browseBtn = document.getElementById('browse-button');
const fileList = document.getElementById('file-list');

// Highlight drag area
['dragenter', 'dragover'].forEach(event => {
  dropArea.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add('dragover');
  }, false);
});

// Remove highlight
['dragleave', 'drop'].forEach(event => {
  dropArea.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
  }, false);
});

// Handle drop
dropArea.addEventListener('drop', e => {
  const files = e.dataTransfer.files;

  if (files.length) handleFiles(files);
}, false);

// Handle browse button
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(fileListObj) {
  fileList.innerHTML = '';
  const files = Array.from(fileListObj);
  console.log("files 2", files);
  files.forEach(file => {
    // Show relative path in UI
    const li = document.createElement('li');
    li.textContent = file.webkitRelativePath || file.name;
    fileList.appendChild(li);
  });

  // Send files to backend
  uploadFolder(files);
}

function uploadFolder(files) {
  // Collect unique folder names from file paths
  const folderNames = Array.from(new Set(
    Array.from(files)
      .map(file => {
        const path = file.webkitRelativePath || file.name;
        return path;
        //return parts.join('/');
      })
      .filter(folder => folder) // Remove empty strings
  ));

  console.log('Unique folder names:', folderNames);

  fetch('/get-files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ folders: folderNames })
  })
}
