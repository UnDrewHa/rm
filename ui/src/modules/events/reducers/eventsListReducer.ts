import {SUCCESS} from 'Core/actions/actionTypes';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {CREATE_EVENT, FIND_EVENTS} from 'Modules/events/actions/actionTypes';
import {IEventModel} from 'Modules/events/models';

const getInitialState = (): IAsyncData<IEventModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

export const eventsListReducer = (
    state: IAsyncData<IEventModel[]> = getInitialState(),
    action: IReduxAction<IEventModel[] | IEventModel>,
): IAsyncData<IEventModel[]> => {
    const {originalType, type, payload} = action;

    if (originalType === FIND_EVENTS) {
        return createAsyncDataReducer<IEventModel[], IEventModel[]>(
            FIND_EVENTS,
            state,
        )(state, action as IReduxAction<IEventModel[]>);
    }

    if (type === CREATE_EVENT + SUCCESS) {
        return {
            ...state,
            data: [...state.data, payload.data as IEventModel],
        };
    }

    return state;
};
