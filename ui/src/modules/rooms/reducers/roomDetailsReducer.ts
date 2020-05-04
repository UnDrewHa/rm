import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {GET_ROOM_BY_ID} from 'modules/rooms/actions/actionTypes';
import {IRoomFullModel} from 'modules/rooms/models';

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
