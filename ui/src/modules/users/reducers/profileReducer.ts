import {SUCCESS} from 'core/actions/actionTypes';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {CLEAR_AUTH_DATA, LOGIN, LOGOUT} from 'modules/auth/actions/actionTypes';
import {
    GET_USER_INFO,
    TOGGLE_FAVOURITE,
    UPDATE_ME,
} from 'modules/users/actions/actionTypes';
import {IUserModel} from 'modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [LOGIN, GET_USER_INFO, UPDATE_ME];
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
