import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {CLEAR_AUTH_DATA, LOGIN, SIGNUP} from 'Modules/auth/actions/actionTypes';
import {GET_USER_INFO} from 'Modules/users/actions/actionTypes';
import {IUserModel} from 'Modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [LOGIN, SIGNUP, GET_USER_INFO];

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
