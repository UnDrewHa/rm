import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_BUILDINGS_DATA,
    GET_FLOOR_DATA,
    UPLOAD_FLOOR_PLAN,
} from 'modules/buildings/actions/actionTypes';
import {IFloorData} from 'modules/buildings/models';

export const getInitialState = (): IAsyncData<IFloorData> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [GET_FLOOR_DATA, UPLOAD_FLOOR_PLAN];

export const floorDataReducer = (
    state: IAsyncData<IFloorData> = getInitialState(),
    action: IReduxAction<IFloorData>,
) => {
    const {originalType, type} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer<IFloorData, IFloorData>(
            originalType,
            state,
        )(state, action);
    }

    if (type === CLEAR_BUILDINGS_DATA) {
        return getInitialState();
    }

    return state;
};
