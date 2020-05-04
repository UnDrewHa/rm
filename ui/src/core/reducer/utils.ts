import {BEGIN, FAIL, SUCCESS} from 'core/actions/actionTypes';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';

interface IHandlersMap<S, A> {
    [actions: string]: (
        state: IAsyncData<S>,
        action: IReduxAction<A>,
    ) => IAsyncData<S>;
}

export const beginReducer = <T>(s: IAsyncData<T>): IAsyncData<T> => ({
    ...s,
    status: EStatusCodes.PENDING,
});

export const successReducer = <T>(
    s: IAsyncData<T>,
    a: IReduxAction<T>,
): IAsyncData<T> => ({
    status: EStatusCodes.SUCCESS,
    data: a.payload.data,
    error: null,
});

export const failReducer = <T, K>(
    s: IAsyncData<T>,
    a: IReduxAction<K>,
): IAsyncData<T> => ({...s, status: EStatusCodes.FAIL, error: a.payload.error});

export const createAsyncDataReducer = <S, A>(
    BASE: string,
    initial: IAsyncData<S>,
    handlers: IHandlersMap<S, A> = {},
) => (
    state: IAsyncData<S> = initial,
    action: IReduxAction<A>,
): IAsyncData<S> => {
    switch (action.type) {
        case BASE + BEGIN:
            return handlers[BEGIN]
                ? handlers[BEGIN](state, action)
                : beginReducer<S>(state);
        case BASE + SUCCESS:
            return handlers[SUCCESS]
                ? handlers[SUCCESS](state, action)
                : successReducer<S>(state, action as IReduxAction<any>);
        case BASE + FAIL:
            return handlers[FAIL]
                ? handlers[FAIL](state, action)
                : failReducer<S, A>(state, action);
    }

    if (handlers[action.type]) {
        return handlers[action.type](state, action);
    }

    return state;
};
