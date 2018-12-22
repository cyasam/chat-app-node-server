const { PORT } = require('../config/keys');

module.exports = {
  AUTH_EXPIRES_IN: 60 * 60 * 2,
  UPLOADS_FOLDER: 'public/uploads',
  UPLOADS_URL: `/uploads`,
  CLIENT_BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://chat-app-node-server.herokuapp.com'
      : 'http://localhost:9999',
  SERVER_BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://chat-app-node-server.herokuapp.com'
      : `http://localhost:${PORT}`,
};
