import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {FIND_ROOMS} from 'Modules/rooms/actions/actionTypes';
import {IRoomModel} from 'Modules/rooms/models';

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
