const jimp = require('jimp');

const splitFileName = filename => {
  const fileNameSplit = filename.split('.');
  const name = fileNameSplit[0];
  const ext = fileNameSplit[1];

  return {
    name,
    ext,
  };
};

const profileImageProcess = image =>
  jimp
    .read(image.path)
    .then(profileImage => {
      const { name, ext } = splitFileName(image.filename);
      profileImage
        .cover(70, 70)
        .write(`${process.env.UPLOADS_FOLDER}/images/${name}-thumb.${ext}`);
      return true;
    })
    .catch(err => {
      throw err;
    });

const createProfileImageObject = (image, serverBaseUrl) => {
  const { name, ext } = image ? splitFileName(image) : {};
  const profileImage = {};
  const uploadsUrl = `//${serverBaseUrl}${process.env.UPLOADS_URL}`;

  profileImage.thumb = image
    ? `${uploadsUrl}/images/${name}-thumb.${ext}`
    : null;
  profileImage.original = image ? `${uploadsUrl}/images/${name}.${ext}` : null;

  return profileImage;
};

module.exports = {
  splitFileName,
  profileImageProcess,
  createProfileImageObject,
};
