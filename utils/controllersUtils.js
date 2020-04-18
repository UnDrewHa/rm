/**
 * Получить объект с данными из тела запроса.
 *
 * @param {object} obj Тело запроса.
 * @param {String[]} [keys] Список ключей, которые нужно считать из тела запроса.
 *
 * @returns {object} Объект с данными из тела запроса.
 */
exports.getFieldsFromObject = function (obj = {}, keys = []) {
    const result = {};

    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });

    return result;
};

/**
 * Добавляет .catch переданной функции-обработчику мидлвара роутера.
 *
 * @param {function} fn Функция-обработчик мидлвара роутера.
 *
 * @returns {function} Функцию-обработчик с .catch.
 */
exports.catchAsync = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

/**
 * Сформировать и отправит JWT Token.
 *
 * @param {object} res Объект ответа.
 * @param {number} statusCode HTTP Status Code.
 * @param {object} user Пользователь.
 * @param {object} data Данные, для отправки с ответом.
 *
 * @returns {void} void.
 */
//TODO: отвязаться от express.
exports.createAndSendToken = function (res, statusCode, user, data = null) {
    const token = user.getToken(user);
    //TODO: вынести в функцию получения конфига.
    const cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    data && (data.password = undefined); //TODO: разобраться что за хуйня

    res.status(statusCode).json({
        data,
    });
};
