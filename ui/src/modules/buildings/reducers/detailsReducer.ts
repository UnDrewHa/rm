import {EStatusCodes} from 'src/Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/Core/reducer/model';
import {createAsyncDataReducer} from 'src/Core/reducer/utils';
import {
    CLEAR_BUILDINGS_DATA,
    GET_BUILDING_BY_ID,
} from 'src/Modules/buildings/actions/actionTypes';
import {IBuildingModel} from 'src/Modules/buildings/models';

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
