
const chatController = (io) => {
  io.on('connection', (sck) => {
    const socket = sck;

    socket.on('add user', ({ email, nickname }) => {
      socket.email = email;
      socket.nickname = nickname;
    });

    socket.on('new message', (text) => {
      socket.broadcast.emit('new message', {
        email: socket.email,
        nickname: socket.nickname,
        text
      });
    });

    socket.on('typing', () => {
      socket.broadcast.emit('typing', {
        email: socket.email,
        nickname: socket.nickname
      });
    });

    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', {
        email: socket.email,
        nickname: socket.nickname
      });
    });
  });
};

module.exports = chatController;
