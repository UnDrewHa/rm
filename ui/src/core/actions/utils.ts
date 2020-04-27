import {Dispatch} from 'redux';
import {BEGIN, FAIL, SUCCESS} from 'Core/actions/actionTypes';

/**
 * Обертка для асинхронных экшенов.
 * Добавляет BEGIN, SUCCESS, FAIL к экшену.
 *
 * @param {Dispatch} dispatch.
 * @param {string} actionType Тип экшена.
 * @param promise Промис получения данных.
 */
export function dispatchAsync<T extends any>(
    dispatch: Dispatch,
    actionType: string,
    promise: Promise<T>,
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

            return res;
        })
        .catch((err) => {
            dispatch({
                type: actionType + FAIL,
                originalType: actionType,
                payload: err?.response?.data || err, //TODO: настроить axios
            });

            throw err?.response?.data || err;
        });
}
