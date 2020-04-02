const nodemailer = require('nodemailer');

exports.sendEmail = ({to, subject, text}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'Test User <mail@blahblah.com>',
    to,
    subject,
    text,
  };

  //TODO: Уничтожать transporter???
  return transporter.sendMail(mailOptions);
};
