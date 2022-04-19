let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)
require('dotenv').config();
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_KEY, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  id: String,
  message: String,
  time: String
});
let Message = mongoose.model('Message', MessageSchema );

app.get('/clients', (req, res) => {
  res.send(Object.keys(io.sockets.clients().connected))
})
let messagesList = []
io.on('connection', socket => {
  console.log(`A user connected with socket id ${socket.id}`)

  socket.broadcast.emit('user-connected', socket.id);

  socket.on('chat message', (msg) => {
    console.log("MESSAGE DATA", msg);
    new Promise(function(resolve, reject) {
      const toSave = new Message({
        id: msg.id,
        message: msg.message,
        time: msg.time
      })
      toSave.save()
      resolve();
    }).then(()=>{messagesList.push(msg)});
    io.emit('chat message', messagesList);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id)
  })

  socket.on('nudge-client', data => {
    socket.broadcast.to(data.to).emit('client-nudged', data)
  })
})

http.listen(5000, () => {
  console.log('http://localhost:5000')
})