/* eslint-disable no-template-curly-in-string */
const dateValidator = (_, value) => {
    if (isNaN(new Date(value).getTime())) {
        return Promise.resolve();
    }

    return Promise.reject();
};
const typeTemplate = 'Поле не соответствует типу ${type}';

export const validationConsts = {
    common: {
        required: [
            {
                required: true,
            },
        ],
    },
    user: {
        login: [
            {
                required: true,
                min: 2,
                max: 20,
                whitespace: true,
                pattern: /^[A-Za-z][A-Za-z\d-_]{1,19}$/gi,
                message:
                    'Имя пользователя может содержать только символы латинского алфавита, числа и -_. Должно начинаться с буквы.',
            },
        ],
        email: [
            {
                required: true,
                type: 'email',
                transform: (value) => value.toLowerCase(),
                whitespace: true,
            },
        ],
        password: [
            {
                required: true,
                min: 8,
                whitespace: true,
            },
        ],
        passwordConfirm: [
            {
                required: true,
                min: 8,
                whitespace: true,
            },
            ({getFieldValue}) => ({
                validator(_, value) {
                    if (getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject('Пароли не совпадают');
                },
            }),
        ],
        newPassword: [
            {
                min: 8,
                whitespace: true,
            },
        ],
    },
    room: {
        name: [
            {
                required: true,
                whitespace: true,
                min: 3,
                max: 25,
            },
        ],
        seats: [
            {
                required: true,
                whitespace: true,
                pattern: /^[1-9]\d*/gi,
            },
        ],
        floor: [
            {
                required: true,
                whitespace: true,
                pattern: /^[1-9]\d*/gi,
            },
        ],
    },
    event: {
        title: [
            {
                required: true,
                whitespace: true,
                min: 5,
            },
        ],
        date: [
            {
                required: true,
                whitespace: true,
                validator: dateValidator,
            },
        ],
        from: [
            {
                required: true,
                whitespace: true,
                validator: dateValidator,
            },
        ],
        to: [
            {
                required: true,
                whitespace: true,
                validator: dateValidator,
            },
        ],
    },
    building: {
        address: [
            {
                required: true,
                whitespace: true,
                min: 10,
            },
        ],
    },
};

export const defaultValidateMessages = {
    default: 'Ошибка валидации поля',
    required: 'Поле обязательно для заполнения',
    enum: 'Значение должно быть одно из [${enum}]',
    whitespace: 'Поле не может содержать одни пробелы',
    date: {
        format:
            'Значение поля невозможно привести к определенному формату даты',
        parse: 'Значение поля невозможно привести к дате',
        invalid: 'Некорректная дата',
    },
    types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
    },
    string: {
        len: 'Количество символов должно быть равно ${len}',
        min: 'Минимальное количество символов - ${min}',
        max: 'Максимальное количество символов - ${max}',
        range: 'Количество символов должно быть между ${min} и ${max}',
    },
    number: {
        len: 'Значение должно быть равно ${len}',
        min: 'Значение не может быть меньше чем ${min}',
        max: 'Значение не может быть больше чем ${max}',
        range: 'Значение должно быть между ${min} и ${max}',
    },
    array: {
        len: 'Длинна списка должна быть равна ${len}',
        min: 'Длинна списка не должна быть меньше ${min}',
        max: 'Длинна списка не должна быть больше ${max}',
        range: 'Длинна списка должна быть между ${min} и ${max}',
    },
    pattern: {
        mismatch: 'Поле не соответствует формату: ${pattern}',
    },
};
