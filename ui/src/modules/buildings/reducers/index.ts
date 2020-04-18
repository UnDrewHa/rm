import {handleActions} from 'redux-actions';
import {BEGIN, FAIL, SUCCESS} from 'src/core/actions/actionTypes';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {
    CLEAR_BUILDINGS_DATA,
    GET_BUILDINGS,
} from 'src/modules/buildings/actions/actionTypes';
import {IBuildingModel} from 'src/modules/buildings/models';

export const getInitialState = (): IAsyncData<IBuildingModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const buildingsReducer = handleActions(
    {
        [GET_BUILDINGS + BEGIN]: (): IAsyncData<IBuildingModel[]> => ({
            status: EStatusCodes.PENDING,
            data: null,
            error: null,
        }),
        [GET_BUILDINGS + SUCCESS]: (
            _,
            action: IReduxAction<IBuildingModel[]>,
        ): IAsyncData<IBuildingModel[]> => ({
            status: EStatusCodes.SUCCESS,
            data: action.payload.data,
            error: null,
        }),
        [GET_BUILDINGS + FAIL]: (
            state: IAsyncData<IBuildingModel[]>,
            action: IReduxAction<IBuildingModel[]>,
        ): IAsyncData<IBuildingModel[]> => ({
            ...state,
            status: EStatusCodes.FAIL,
            error: action.payload.error,
        }),
        [CLEAR_BUILDINGS_DATA]: () => getInitialState(),
    },
    getInitialState(),
);
