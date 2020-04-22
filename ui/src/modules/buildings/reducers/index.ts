import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
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

export const buildingsReducer = (
    state: IAsyncData<IBuildingModel[]> = getInitialState(),
    action: IReduxAction<IBuildingModel[]>,
) => {
    if (action.originalType === GET_BUILDINGS) {
        return createAsyncDataReducer<IBuildingModel[], IBuildingModel[]>(
            GET_BUILDINGS,
            state,
        )(state, action);
    }

    if (action.type === CLEAR_BUILDINGS_DATA) {
        return getInitialState();
    }

    return state;
};
