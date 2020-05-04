import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {CLEAR_AUTH_DATA} from 'modules/auth/actions/actionTypes';
import {GET_USER_BY_ID} from 'modules/users/actions/actionTypes';
import {IUserModel} from 'modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [GET_USER_BY_ID];

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
