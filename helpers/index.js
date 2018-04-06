const jimp = require('jimp');
const { UPLOADS_FOLDER } = require('../config/consts');

const splitFileName = (filename) => {
  const fileNameSplit = filename.split('.');
  const name = fileNameSplit[0];
  const ext = fileNameSplit[1];

  return { name, ext };
};

const profileImageProcess = image => jimp.read(image.path).then((profileImage) => {
  const { name, ext } = splitFileName(image.filename);
  profileImage.cover(70, 70).write(`${UPLOADS_FOLDER}/images/${name}-thumb.${ext}`);
  return true;
}).catch((err) => {
  throw err;
});

module.exports = {
  splitFileName,
  profileImageProcess
};
