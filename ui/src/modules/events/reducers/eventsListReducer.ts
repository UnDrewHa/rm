import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData, IReduxAction} from 'src/core/reducer/model';
import {createAsyncDataReducer} from 'src/core/reducer/utils';
import {FIND_EVENTS} from 'src/modules/events/actions/actionTypes';
import {IEventModel} from 'src/modules/events/models';

const getInitialState = (): IAsyncData<IEventModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const eventsListReducer = (
    state: IAsyncData<IEventModel[]> = getInitialState(),
    action: IReduxAction<IEventModel[]>,
): IAsyncData<IEventModel[]> => {
    const {originalType} = action;

    if (originalType === FIND_EVENTS) {
        return createAsyncDataReducer<IEventModel[], IEventModel[]>(
            FIND_EVENTS,
            state,
        )(state, action);
    }

    return state;
};
