const nodemailer = require('nodemailer');

/**
 * Отправить E-mail сообщение.
 *
 * @param {object} data Данные для отправки (to, subject, text).
 *
 * @returns {Promise} Промис отправки сообщения.
 */
exports.sendEmail = ({to, subject, text}) => {
  //TODO: вынести создание отсюда.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //TODO: сделать какую-нить фабрику писем, чтобы не передавать из кода текст.
  const mailOptions = {
    from: 'Test User <mail@blahblah.com>',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
