import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {
    CLEAR_AUTH_DATA,
    LOGIN,
    SIGNUP,
} from 'src/modules/auth/actions/actionTypes';
import {IUserModel} from 'src/modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [LOGIN, SIGNUP];

export const userReducer = (
    state: IAsyncData<IUserModel> = getInitialState(),
    action: IReduxAction<IUserModel>,
) => {
    if (asyncActions.includes(action.originalType)) {
        return createAsyncDataReducer(action.originalType, state)(
            state,
            action,
        );
    }

    if (action.type === CLEAR_AUTH_DATA) {
        return getInitialState();
    }

    return state;
};
