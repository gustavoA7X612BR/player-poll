const emailTransporter = require('../module/nodemailer');
const getHBSTemplateFromFile = require('../module/handlebars');

exports.sendPassowordResetEmail = async (userId, token, email) => {
  const emailTemplate = getHBSTemplateFromFile('resetPassword');
  const emailHtml = emailTemplate({
    token,
    userId,
  });

  const message = {
    to: email,
    subject: 'Password Reset Request',
    html: emailHtml,
  };

  emailTransporter.sendMail(message);
};
