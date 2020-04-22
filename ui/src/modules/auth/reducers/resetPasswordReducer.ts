import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {
    CLEAR_AUTH_DATA,
    RESET_PASSWORD,
} from 'src/modules/auth/actions/actionTypes';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';

export const getInitialState = (): IAsyncData<null> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const resetPasswordReducer = (
    state: IAsyncData<null> = getInitialState(),
    action: IReduxAction<null>,
) => {
    if (action.originalType === RESET_PASSWORD) {
        return createAsyncDataReducer<null, null>(RESET_PASSWORD, state)(
            state,
            action,
        );
    }

    if (action.type === CLEAR_AUTH_DATA) {
        return getInitialState();
    }
    return state;
};
