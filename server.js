const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000')
})

//socket
const io = socket(server);
const messeges = [];
let users = [];

io.on('connection', (socket) => {

  socket.on('join', (userName) => {
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit('newUser', {
      author: 'Chat-Boot',
      content: `${userName} has joined the conversation`
    })
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messeges.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    if (users.length > 0) {
      const exitUser = users.find(user => user.id == socket.id);
      const leftUsers = users.filter(user => user.id !== socket.id)
      socket.broadcast.emit('exitUser', {
        author: 'Chat-Boot',
        content: exitUser + ' has left the conversation...'
      })
      users = leftUsers
    }
  })
});

app.set('html', __dirname + '/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'client')));
app.get('/', (req, res) => {
  res.sendFile('Index.html')
})
app.get('/favicon.ico', (req, res) => {
  res.status(204);
  res.end();
});

app.use((req, res) => {
  res.status(400).send('404 page not found...');
});