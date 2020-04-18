import {handleActions, combineActions} from 'redux-actions';
import {BEGIN, FAIL, SUCCESS} from 'src/core/actions/actionTypes';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {
    CLEAR_AUTH_DATA,
    LOGIN,
    SIGNUP,
} from 'src/modules/auth/actions/actionTypes';
import {IUserModel} from 'src/modules/auth/models';

export const getInitialState = (): IAsyncData<IUserModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const userReducer = handleActions(
    {
        [combineActions(LOGIN + BEGIN, SIGNUP + BEGIN)]: (): IAsyncData<
            IUserModel
        > => ({
            status: EStatusCodes.PENDING,
            data: null,
            error: null,
        }),
        [combineActions(LOGIN + SUCCESS, SIGNUP + SUCCESS)]: (
            _,
            action: IReduxAction<IUserModel>,
        ): IAsyncData<IUserModel> => ({
            status: EStatusCodes.SUCCESS,
            data: action.payload.data,
            error: null,
        }),
        [combineActions(LOGIN + FAIL, SIGNUP + FAIL)]: (
            state: IAsyncData<IUserModel>,
            action: IReduxAction<IUserModel>,
        ): IAsyncData<IUserModel> => ({
            ...state,
            status: EStatusCodes.FAIL,
            error: action.payload.error,
        }),
        [CLEAR_AUTH_DATA]: () => getInitialState(),
    },
    getInitialState(),
);
