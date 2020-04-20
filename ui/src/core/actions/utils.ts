import {Dispatch} from 'redux';
import {BEGIN, SUCCESS, FAIL} from 'src/core/actions/actionTypes';

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
    });

    return promise
        .then((res) => {
            dispatch({
                type: actionType + SUCCESS,
                payload: res.data,
            });

            return res.data;
        })
        .catch((err) => {
            dispatch({
                type: actionType + FAIL,
                payload: err.response.data, //TODO: настроить axios
            });

            throw err.response.data;
        });
}
