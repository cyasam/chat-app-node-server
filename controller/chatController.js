const uuidv4 = require('uuid/v4');

const chatController = io => {
  const activeUsers = {};

  io.on('connection', sck => {
    const socket = sck;

    socket.on('add user', ({ email, nickname }) => {
      const activeUserId = Object.keys(activeUsers).find(
        id => activeUsers[id].email === email,
      );

      let userId;
      if (!activeUserId) {
        userId = uuidv4();
        const newUser = {
          email,
          nickname,
        };
        activeUsers[userId] = newUser;
      }

      socket.userId = activeUserId || userId;
      socket.email = email;

      io.sockets.emit('active users', activeUsers);
    });

    socket.on('new message', text => {
      if (activeUsers[socket.userId]) {
        const { email, nickname } = activeUsers[socket.userId];
        socket.broadcast.emit('new message', {
          email,
          nickname,
          text,
        });
      }
    });

    socket.on('typing', () => {
      if (activeUsers[socket.userId]) {
        const { email, nickname } = activeUsers[socket.userId];
        socket.broadcast.emit('typing', {
          email,
          nickname,
        });
      }
    });

    socket.on('stop typing', () => {
      if (activeUsers[socket.userId]) {
        const { email, nickname } = activeUsers[socket.userId];
        socket.broadcast.emit('stop typing', {
          email,
          nickname,
        });
      }
    });

    socket.on('disconnect', () => {
      delete activeUsers[socket.userId];

      io.sockets.emit('active users', activeUsers);
    });
  });
};

module.exports = chatController;
