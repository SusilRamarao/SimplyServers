const express = require('express');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Run your shell command when a client connects
  const cmd = spawn('cmd.exe', ['/c', 'C:\\Project\\cfw_nxp\\project\\VCU-P-NXP-M7-BSW\\Tools\\install_tools.bat']);

  console.log("log", cmd)

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
