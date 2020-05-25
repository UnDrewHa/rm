import {SUCCESS} from 'core/actions/actionTypes';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {includes} from 'lodash-es';
import {
    APPROVE_EVENT,
    CLEAR_EVENT_DATA,
    DELETE_EVENTS,
    FIND_EVENTS,
    REFUSE_EVENT,
} from 'modules/events/actions/actionTypes';
import {IEventModel} from 'modules/events/models';

const getInitialState = (): IAsyncData<IEventModel[]> => ({
    status: EStatusCodes.IDLE,
    data: [],
    error: null,
});

const removeItemsActions = [
    DELETE_EVENTS + SUCCESS,
    APPROVE_EVENT + SUCCESS,
    REFUSE_EVENT + SUCCESS,
];

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

    if (removeItemsActions.includes(type)) {
        const newData = state.data.filter(
            (item) => !includes(payload.data, item._id),
        );
        return {
            ...state,
            data: newData,
        };
    }

    if (type === CLEAR_EVENT_DATA) {
        return getInitialState();
    }

    return state;
};
