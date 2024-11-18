const http = require('http');
const app = require('./app');
require('dotenv').config();
const conncectDB = require('./config/db');
const PORT = process.env.PORT || 8000 ;
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, //'http://localhost:5173', // , // Allow requests from your frontend's origin
    methods: ["GET", "POST"]
  }
});
app.set('socketio', io);


conncectDB();
io.on('connection', (socket) => {

  socket.on('disconnect', () => {
  });
});
  server.listen(PORT, console.log(`server is running on port ${PORT}`));

  process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
