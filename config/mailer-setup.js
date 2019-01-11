const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTPMAIL_USERNAME,
    pass: process.env.SMTPMAIL_PASSWORD
  }
});

const accountActivationMail = (email, name, activationKey) =>
  new Promise((resolve, reject) => {
    const mailOptions = {
      from: `${process.env.SMTPMAIL_SENDERNAME} ${
        process.env.SMTPMAIL_USERNAME
      }`,
      to: email,
      subject: 'Please activate your account - Chat App',
      html: `<p>Hello ${name || 'User'}</p>
      <p><a href="${
        process.env.CLIENT_BASE_URL
      }/register/complete?key=${activationKey}">
      Please activate your account.</a></p>`
    };

    transporter.sendMail(mailOptions, error => {
      if (error) {
        reject(error);
      }

      resolve(true);
    });
  });

module.exports = {
  accountActivationMail
};
