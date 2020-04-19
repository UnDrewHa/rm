import {BEGIN, FAIL, SUCCESS} from 'src/core/actions/actionTypes';
import {handleActions} from 'redux-actions';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {
    CLEAR_PERMISSIONS,
    GET_PERMISSIONS,
} from 'src/modules/permissions/actions/actionTypes';
import {TPermissionsList} from 'src/modules/permissions/models';

export const getInitialState = (): IAsyncData<TPermissionsList> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const permissionsReducer = handleActions(
    {
        [GET_PERMISSIONS + BEGIN]: () => ({
            status: EStatusCodes.PENDING,
            data: null,
            error: null,
        }),
        [GET_PERMISSIONS + SUCCESS]: (
            _,
            action: IReduxAction<TPermissionsList>,
        ) => ({
            status: EStatusCodes.SUCCESS,
            data: action.payload.data,
            error: null,
        }),
        [GET_PERMISSIONS + FAIL]: (
            prevState: IAsyncData<TPermissionsList>,
            action: IReduxAction<TPermissionsList>,
        ) => ({
            ...prevState,
            status: EStatusCodes.FAIL,
            error: action.payload.error,
        }),
        [CLEAR_PERMISSIONS]: () => getInitialState(),
    },
    getInitialState(),
);
