import {BEGIN, FAIL, SUCCESS} from 'src/core/actions/actionTypes';
import {
    CLEAR_AUTH_DATA,
    RESET_PASSWORD,
} from 'src/modules/auth/actions/actionTypes';
import {handleActions} from 'redux-actions';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';

export const getInitialState = (): IAsyncData<null> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const resetPasswordReducer = handleActions(
    {
        [RESET_PASSWORD + BEGIN]: () => ({
            status: EStatusCodes.PENDING,
            data: null,
            error: null,
        }),
        [RESET_PASSWORD + SUCCESS]: () => ({
            status: EStatusCodes.SUCCESS,
            data: null,
            error: null,
        }),
        [RESET_PASSWORD + FAIL]: (
            prevState: IAsyncData<null>,
            action: IReduxAction<null>,
        ) => ({
            ...prevState,
            status: EStatusCodes.FAIL,
            error: action.payload.error,
        }),
        [CLEAR_AUTH_DATA]: () => getInitialState(),
    },
    getInitialState(),
);
