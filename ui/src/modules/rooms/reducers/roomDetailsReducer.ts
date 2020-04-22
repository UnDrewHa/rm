import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {GET_ROOM_BY_ID} from 'src/modules/rooms/actions/actionTypes';
import {IRoomModel} from 'src/modules/rooms/models';

const getInitialState = (): IAsyncData<IRoomModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const roomDetailsReducer = (
    state: IAsyncData<IRoomModel> = getInitialState(),
    action: IReduxAction<IRoomModel>,
): IAsyncData<IRoomModel> => {
    const {originalType} = action;

    if (originalType === GET_ROOM_BY_ID) {
        return createAsyncDataReducer<IRoomModel, IRoomModel>(
            GET_ROOM_BY_ID,
            state,
        )(state, action);
    }

    return state;
};
