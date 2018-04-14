const { PORT } = require('./keys');

module.exports = {
  AUTH_EXPIRES_IN: 60 * 60 * 2,
  UPLOADS_FOLDER: 'public/uploads',
  UPLOADS_URL: `//localhost:${PORT}/uploads`
};
