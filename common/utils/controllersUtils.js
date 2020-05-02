/**
 * Получить настройки для кук токена.
 */
const getTokenCookieOptions = () => {
    const cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    return cookieOptions;
};

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
 */
exports.createAndSendToken = function (req, res) {
    const {user} = res.locals;
    const token = user.getToken();

    res.cookie('token', token, getTokenCookieOptions());

    user.password = undefined;

    res.status(200).json({
        data: user,
    });
};
