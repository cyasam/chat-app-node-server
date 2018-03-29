const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const { mongoDB } = require('./config/keys');
const chatController = require('./controller/chatController');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.connect(mongoDB.uri, () => console.log('connected to DB.'));

const PORT = 4567;

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passportSetup();
chatController(io);

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.get('*', (req, res) => {
  res.send({ message: 'URL doesn\'t exist' });
});

http.listen(PORT, () => console.log(`API is running on ${PORT}`));
