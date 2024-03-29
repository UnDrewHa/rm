import {filter, includes} from 'lodash-es';
import {SUCCESS} from 'core/actions/actionTypes';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_ROOMS_DATA,
    DELETE_ROOMS,
    FIND_ROOMS,
} from 'modules/rooms/actions/actionTypes';
import {IRoomModel} from 'modules/rooms/models';

const getInitialState = (): IAsyncData<IRoomModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

const asyncActions = [FIND_ROOMS];

export const roomsListReducer = (
    state: IAsyncData<IRoomModel[]> = getInitialState(),
    action: IReduxAction<IRoomModel[]>,
): IAsyncData<IRoomModel[]> => {
    const {originalType, type, payload} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer<IRoomModel[], IRoomModel[]>(
            originalType,
            state,
        )(state, action);
    }

    if (type === DELETE_ROOMS + SUCCESS) {
        const newData = filter(
            state.data,
            (item) => !includes(payload.data, item._id),
        );

        return {
            ...state,
            data: newData,
        };
    }

    if (type === CLEAR_ROOMS_DATA) {
        return getInitialState();
    }

    return state;
};
