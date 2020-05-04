import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_PERMISSIONS,
    GET_PERMISSIONS,
} from 'modules/permissions/actions/actionTypes';
import {TPermissionsList} from 'modules/permissions/models';

export const getInitialState = (): IAsyncData<TPermissionsList> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const permissionsReducer = (
    state: IAsyncData<TPermissionsList> = getInitialState(),
    action: IReduxAction<TPermissionsList>,
) => {
    if (action.originalType === GET_PERMISSIONS) {
        return createAsyncDataReducer<TPermissionsList, TPermissionsList>(
            GET_PERMISSIONS,
            state,
        )(state, action);
    }

    if (action.type === CLEAR_PERMISSIONS) {
        return getInitialState();
    }

    return state;
};
