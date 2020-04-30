import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {CLEAR_AUTH_DATA} from 'Modules/auth/actions/actionTypes';
import {GET_USER_BY_ID} from 'Modules/users/actions/actionTypes';
import {IUserModel} from 'Modules/users/models';

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
