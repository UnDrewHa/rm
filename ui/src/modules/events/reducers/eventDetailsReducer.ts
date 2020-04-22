import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {GET_EVENT_BY_ID} from 'src/modules/events/actions/actionTypes';
import {IEventModel} from 'src/modules/events/models';

const getInitialState = (): IAsyncData<IEventModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

export const eventDetailsReducer = (
    state: IAsyncData<IEventModel> = getInitialState(),
    action: IReduxAction<IEventModel>,
): IAsyncData<IEventModel> => {
    const {originalType} = action;

    if (originalType === GET_EVENT_BY_ID) {
        return createAsyncDataReducer<IEventModel, IEventModel>(
            GET_EVENT_BY_ID,
            state,
        )(state, action);
    }

    return state;
};
