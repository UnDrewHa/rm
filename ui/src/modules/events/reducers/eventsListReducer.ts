import {includes} from 'lodash-es';
import {SUCCESS} from 'Core/actions/actionTypes';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {DELETE_EVENTS, FIND_EVENTS} from 'Modules/events/actions/actionTypes';
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

    if (type === DELETE_EVENTS + SUCCESS) {
        const newData = state.data.filter(
            (item) => !includes(payload.data, item._id),
        );
        return {
            ...state,
            data: newData,
        };
    }

    return state;
};
