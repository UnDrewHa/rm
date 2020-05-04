import {isFunction} from 'lodash-es';
import {Dispatch} from 'redux';
import {BEGIN, FAIL, SUCCESS} from 'Core/actions/actionTypes';

/**
 * Обертка для асинхронных экшенов.
 * Добавляет BEGIN, SUCCESS, FAIL к экшену.
 *
 * @param {Dispatch} dispatch.
 * @param {string} actionType Тип экшена.
 * @param promise Промис получения данных.
 * @param options Доп. параметры.
 */
export function dispatchAsync<T extends any>(
    dispatch: Dispatch,
    actionType: string,
    promise: Promise<T>,
    options: any = {},
): Promise<T> {
    dispatch({
        type: actionType + BEGIN,
        originalType: actionType,
    });

    return promise
        .then((res) => {
            dispatch({
                type: actionType + SUCCESS,
                originalType: actionType,
                payload: res.data,
            });

            isFunction(options.onSuccess) && options.onSuccess(res.data);
            return res;
        })
        .catch((err) => {
            const error = err?.response?.data || err;

            dispatch({
                type: actionType + FAIL,
                originalType: actionType,
                payload: error,
            });

            isFunction(options.onError) && options.onError(error);
            throw err?.response?.data || err;
        });
}
