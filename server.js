const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000')
})

//socket
const io = socket(server);
const tasks = [];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', (taskId) => {
    const index = tasks.findIndex(task => task.id === taskId);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', taskId);
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messeges.push(message);
    socket.broadcast.emit('message', message);
  });

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