const express = require('express');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const generateUniqueId = require('generate-unique-id');

app.get("/hello", (req, res) => {

  res.sendFile(__dirname + '/public/menu.html');
});

app.post('/get-files', (req, res) => {
  
  console.log('Received folders:', req.body);
  //const { folders } = req.body;
  //console.log('Received folders:', folders);
  // Do something with the folder names
  //res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Run your shell command when a client connects
  const cmd = spawn('python', ['--version']);

  //console.log("log", cmd)

  // example 1
  const id1 = generateUniqueId();

  // example 2
  const id2 = generateUniqueId({
  length: 32,
  useLetters: false
  });

  console.log("unique id ", id1, id2);

  cmd.stdout.on('data', (data) => {
    socket.emit('log', data.toString());
  });

  cmd.stderr.on('data', (data) => {
    socket.emit('log', `ERROR: ${data.toString()}`);
  });

  cmd.on('close', (code) => {
    socket.emit('log', `Process exited with code ${code}`);
  });

  socket.on('disconnect', () => {
    cmd.kill();
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
