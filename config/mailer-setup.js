const nodemailer = require('nodemailer');
const { smtpMail } = require('./keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpMail.user,
    pass: smtpMail.password
  }
});

const accountActivationMail = (email, name, activationKey) => new Promise((resolve, reject) => {
  const mailOptions = {
    from: `${smtpMail.senderName} ${smtpMail.user}`,
    to: email,
    subject: 'Hello ✔',
    text: `Hello ${name || 'User'}`,
    html: `<a href="http://192.168.1.13:1234/register/complete?key=${activationKey}">Please activate your account.</a>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      reject(error);
    }

    resolve(true);
  });
});

module.exports = {
  accountActivationMail
};
