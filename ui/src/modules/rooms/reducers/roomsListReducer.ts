import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {FIND_ROOMS} from 'src/modules/rooms/actions/actionTypes';
import {IRoomModel} from 'src/modules/rooms/models';

const getInitialState = (): IAsyncData<IRoomModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const roomsListReducer = (
    state: IAsyncData<IRoomModel[]> = getInitialState(),
    action: IReduxAction<IRoomModel[]>,
): IAsyncData<IRoomModel[]> => {
    const {originalType} = action;

    if (originalType === FIND_ROOMS) {
        return createAsyncDataReducer<IRoomModel[], IRoomModel[]>(
            FIND_ROOMS,
            state,
        )(state, action);
    }

    return state;
};
