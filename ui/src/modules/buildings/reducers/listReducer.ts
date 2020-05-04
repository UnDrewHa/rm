import {filter, includes} from 'lodash-es';
import {SUCCESS} from 'core/actions/actionTypes';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_BUILDINGS_DATA,
    DELETE_BUILDINGS,
    GET_BUILDINGS,
} from 'modules/buildings/actions/actionTypes';
import {IBuildingModel} from 'modules/buildings/models';

export const getInitialState = (): IAsyncData<IBuildingModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

const asyncActions = [GET_BUILDINGS];

export const buildingsListReducer = (
    state: IAsyncData<IBuildingModel[]> = getInitialState(),
    action: IReduxAction<IBuildingModel[]>,
) => {
    const {originalType, type, payload} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer<IBuildingModel[], IBuildingModel[]>(
            originalType,
            state,
        )(state, action);
    }

    if (type === DELETE_BUILDINGS + SUCCESS) {
        const newData = filter(
            state.data,
            (item) => !includes(payload.data, item._id),
        );

        return {
            ...state,
            data: newData,
        };
    }

    if (action.type === CLEAR_BUILDINGS_DATA) {
        return getInitialState();
    }

    return state;
};
