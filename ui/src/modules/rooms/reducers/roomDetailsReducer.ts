import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {GET_ROOM_BY_ID} from 'Modules/rooms/actions/actionTypes';
import {IRoomFullModel} from 'Modules/rooms/models';

const getInitialState = (): IAsyncData<IRoomFullModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const roomDetailsReducer = (
    state: IAsyncData<IRoomFullModel> = getInitialState(),
    action: IReduxAction<IRoomFullModel>,
): IAsyncData<IRoomFullModel> => {
    const {originalType} = action;

    if (originalType === GET_ROOM_BY_ID) {
        return createAsyncDataReducer<IRoomFullModel, IRoomFullModel>(
            GET_ROOM_BY_ID,
            state,
        )(state, action);
    }

    return state;
};
