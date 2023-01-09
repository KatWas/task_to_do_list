const express = require('express');
const path = require('path');


const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000')
})

// view engine setup

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/public')));

app.engine('js', require('ejs').renderFile);//jaki silnik???
app.set('view engine', 'js');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/src/index.js'))
})

// error handler
app.use((req, res) => {
  res.status(400).send({ message: '404 page not found...'});
});