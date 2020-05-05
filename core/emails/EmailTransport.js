const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const {catchAsync} = require('../../common/utils/controllersUtils');

const readFile = util.promisify(fs.readFile);

const templates = {};

/**
 * Отправить E-mail сообщение.
 *
 * @returns {Promise} Промис отправки сообщения.
 */
const sendEmail = (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter.sendMail(mailOptions);
};

/**
 * Отправить письмо для сброса пароля пользователя.
 *
 * @param email Эл. почта.
 * @param token Токен для сброса.
 *
 * @returns {Promise} Промис отправки сообщения.
 */
exports.sendMailWithResetToken = catchAsync(async (email, token) => {
    let tpl = (templates['resetPasswordMail'] =
        templates['resetPasswordMail'] ||
        (await readFile(
            `${process.cwd()}/core/emails/templates/resetPasswordMail.html`,
            'utf8',
        )));

    tpl = tpl.replace(/{{ORIGIN}}/gi, process.env.PRODUCTION_ORIGIN);
    tpl = tpl.replace(/{{TOKEN}}/gi, token);

    const mailOptions = {
        from: 'support@' + process.env.PRODUCTION_ORIGIN,
        to: email,
        subject:
            'Восстановление пароля в системе ' + process.env.PRODUCTION_ORIGIN,
        html: tpl,
    };

    return sendEmail(mailOptions);
});
