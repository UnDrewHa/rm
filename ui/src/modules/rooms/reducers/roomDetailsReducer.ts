import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_ROOMS_DETAILS,
    GET_ROOM_BY_ID,
} from 'modules/rooms/actions/actionTypes';
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
    const {originalType, type} = action;

    if (originalType === GET_ROOM_BY_ID) {
        return createAsyncDataReducer<IRoomFullModel, IRoomFullModel>(
            originalType,
            state,
        )(state, action);
    }

    if (type === CLEAR_ROOMS_DETAILS) {
        return getInitialState();
    }

    return state;
};
