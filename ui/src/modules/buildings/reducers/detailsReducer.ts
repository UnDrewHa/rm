import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {
    CLEAR_BUILDINGS_DATA,
    GET_BUILDING_BY_ID,
} from 'Modules/buildings/actions/actionTypes';
import {IBuildingModel} from 'Modules/buildings/models';

export const getInitialState = (): IAsyncData<IBuildingModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [GET_BUILDING_BY_ID];

export const buildingDetailsReducer = (
    state: IAsyncData<IBuildingModel> = getInitialState(),
    action: IReduxAction<IBuildingModel>,
) => {
    if (asyncActions.includes(action.originalType)) {
        return createAsyncDataReducer<IBuildingModel, IBuildingModel>(
            action.originalType,
            state,
        )(state, action);
    }

    if (action.type === CLEAR_BUILDINGS_DATA) {
        return getInitialState();
    }

    return state;
};
