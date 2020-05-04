import {filter, includes} from 'lodash-es';
import {SUCCESS} from 'Core/actions/actionTypes';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {
    CLEAR_USERS_DATA,
    DELETE_USERS,
    FIND_USERS,
} from 'Modules/users/actions/actionTypes';
import {IUserModel} from 'Modules/users/models';

export const getInitialState = (): IAsyncData<IUserModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

const asyncActions = [FIND_USERS];

export const usersListReducer = (
    state: IAsyncData<IUserModel[]> = getInitialState(),
    action: IReduxAction<IUserModel[]>,
) => {
    const {originalType, type, payload} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer(originalType, state)(state, action);
    }

    if (type === DELETE_USERS + SUCCESS) {
        const newData = filter(
            state.data,
            (item) => !includes(payload.data, item._id),
        );

        return {
            ...state,
            data: newData,
        };
    }

    if (type === CLEAR_USERS_DATA) {
        return getInitialState();
    }

    return state;
};
