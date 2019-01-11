const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const passportSetup = require('./config/passport-setup');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const chatController = require('./controller/chatController');

const PORT = process.env.PORT || 4567;

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  },
  () => console.log('connected to DB.')
);

app.use(helmet());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(express.static('public'));
passportSetup();
chatController(io);

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.get('*', (req, res) => {
  fs.readFile('./public/index.html', (err, html) => {
    if (err) {
      throw err;
    }
    res.writeHeader(200, {
      'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
  });
});

http.listen(PORT, () => console.log(`API is running on ${PORT}`));
