import {SUCCESS} from 'src/Core/actions/actionTypes';
import {EStatusCodes} from 'src/Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/Core/reducer/model';
import {createAsyncDataReducer} from 'src/Core/reducer/utils';
import {
    CLEAR_AUTH_DATA,
    LOGIN,
    LOGOUT,
    SIGNUP,
} from 'src/Modules/auth/actions/actionTypes';
import {
    GET_USER_INFO,
    TOGGLE_FAVOURITE,
    UPDATE_ME,
} from 'src/Modules/users/actions/actionTypes';
import {IUserModel} from 'src/Modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [LOGIN, SIGNUP, GET_USER_INFO, UPDATE_ME];
const toInitialStateActions = [LOGOUT, CLEAR_AUTH_DATA];

export const profileReducer = (
    state: IAsyncData<IUserModel> = getInitialState(),
    action: IReduxAction<IUserModel>,
) => {
    const {originalType, type, payload} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer(originalType, state)(state, action);
    }

    if (type === TOGGLE_FAVOURITE + SUCCESS) {
        return {
            ...state,
            data: payload.data,
        };
    }

    if (toInitialStateActions.includes(type)) {
        return getInitialState();
    }

    return state;
};
