exports.commonHTTPCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNKNOWN_ERROR: 520,
};

exports.commonErrors = {
    NOT_FOUND: 'Запрашиваемые данные не найдены',
    UNAUTHORIZED: 'Необходимо авторизоваться в приложении',
    FORBIDDEN: 'Доступ запрещен',
    BAD_REQUEST: 'Введите необходимые данные',
};
