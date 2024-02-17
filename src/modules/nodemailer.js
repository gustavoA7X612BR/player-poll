const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  },
  {
    from: 'accounts@playerpoll.com',
  }
);

module.exports = transporter;
