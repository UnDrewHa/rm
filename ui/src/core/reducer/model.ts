import {EStatusCodes} from './enums';

/**
 * Интерфейс данных, получаемых с сервера.
 *
 * @prop {EStatusCodes} status Статус получения.
 * @prop {T} data Данные.
 * @prop {IErrorData} error Ошибка.
 */
export interface IAsyncData<T> {
    status: EStatusCodes;
    data: T;
    error: IErrorData;
}

/**
 * Интерфейс ошибки.
 *
 * @prop {string} status Статус.
 * @prop {string} message Сообщение.
 * @prop {string} [stack] Стек-трейс ошибки.
 * @prop {string} [error] Оригинальный объект ошибки.
 */
export interface IErrorData {
    status: string;
    message: string;
    stack?: string;
    error?: string;
}

/**
 * Интерфейс redux экшена.
 */
export interface IReduxAction<T> {
    type: string;
    payload: {
        data: T;
        error: IErrorData;
    };
}
