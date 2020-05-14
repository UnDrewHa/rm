const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const moment = require('moment');
const {AppError} = require('../../common/errors');
const {commonHTTPCodes} = require('../../common/errors');
const {catchAsync} = require('../../common/utils/controllersUtils');
const {replaceInTemplate} = require('./utils');

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

    tpl = replaceInTemplate(tpl, {
        ORIGIN: process.env.PRODUCTION_ORIGIN,
        ORG_NAME: process.env.ORG_NAME,
        TOKEN: token,
    });

    const mailOptions = {
        from: 'support@' + process.env.PRODUCTION_ORIGIN,
        to: email,
        subject: 'Восстановление пароля | ' + process.env.ORG_NAME,
        html: tpl,
    };

    return sendEmail(mailOptions);
});

/**
 * Отправить письмо о создании встречи.
 *
 * @param email Эл. почта.
 * @param event Данные встречи.
 *
 * @returns {Promise} Промис отправки сообщения.
 */
exports.sendEventMail = catchAsync(async (event) => {
    let tpl = (templates['eventMail'] =
        templates['eventMail'] ||
        (await readFile(
            `${process.cwd()}/core/emails/templates/eventMail.html`,
            'utf8',
        )));

    tpl = replaceInTemplate(tpl, {
        ORIGIN: process.env.PRODUCTION_ORIGIN,
        ORG_NAME: process.env.ORG_NAME,
        SUBJECT: event.title,
        DESCRIPTION: event.description,
        DATE: moment(event.date).format('D MMMM'),
        TIME: moment(event.from).format('HH:mm'),
        ROOM: event.room.name,
        BUILDING: event.owner.building.name,
        FLOOR: event.room.floor + ' Этаж',
        ADDRESS: event.owner.building.address,
        OWNER: event.owner.fullName,
        OWNER_PHONE: event.owner.phone,
        EVENT_ID: event._id,
    });

    const mailOptions = {
        from: 'support@' + process.env.PRODUCTION_ORIGIN,
        to: event.owner.email,
        cc: event.members,
        subject: 'Назначена встреча | ' + process.env.ORG_NAME,
        html: tpl,
    };

    return sendEmail(mailOptions).catch(
        (_) =>
            new AppError(
                'Ошибка в отправке письма о создании встречи',
                commonHTTPCodes.INTERNAL_SERVER_ERROR,
            ),
    );
});

exports.sendEventRefused = catchAsync(async ({roomId, owners}) => {
    let tpl = (templates['eventRefused'] =
        templates['eventRefused'] ||
        (await readFile(
            `${process.cwd()}/core/emails/templates/eventRefused.html`,
            'utf8',
        )));

    tpl = replaceInTemplate(tpl, {
        ORIGIN: process.env.PRODUCTION_ORIGIN,
        ORG_NAME: process.env.ORG_NAME,
        ROOM_ID: roomId,
    });

    const mailOptions = {
        from: 'support@' + process.env.PRODUCTION_ORIGIN,
        to: owners,
        subject: 'Ваши встречи отменены | ' + process.env.ORG_NAME,
        html: tpl,
    };

    return sendEmail(mailOptions).catch(
        (_) =>
            new AppError(
                'Ошибка отправки сообщения о отмене бронирования',
                commonHTTPCodes.INTERNAL_SERVER_ERROR,
            ),
    );
});

exports.sendSingleEventRefuse = catchAsync(
    async ({eventId, eventName, owner}) => {
        let tpl = (templates['singleEventRefused'] =
            templates['singleEventRefused'] ||
            (await readFile(
                `${process.cwd()}/core/emails/templates/singleEventRefused.html`,
                'utf8',
            )));

        tpl = replaceInTemplate(tpl, {
            ORIGIN: process.env.PRODUCTION_ORIGIN,
            ORG_NAME: process.env.ORG_NAME,
            EVENT_ID: eventId,
            EVENT_NAME: eventName,
        });

        const mailOptions = {
            from: 'support@' + process.env.PRODUCTION_ORIGIN,
            to: owner,
            subject: 'Ваша встреча отменена | ' + process.env.ORG_NAME,
            html: tpl,
        };

        return sendEmail(mailOptions).catch(
            (_) =>
                new AppError(
                    'Ошибка отправки сообщения о несогласовании',
                    commonHTTPCodes.INTERNAL_SERVER_ERROR,
                ),
        );
    },
);
