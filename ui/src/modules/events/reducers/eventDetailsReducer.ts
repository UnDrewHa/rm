import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CLEAR_EVENT_DATA,
    CREATE_EVENT,
    GET_EVENT_BY_ID,
} from 'modules/events/actions/actionTypes';
import {IEventFullModel} from 'modules/events/models';

const getInitialState = (): IAsyncData<IEventFullModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [CREATE_EVENT, GET_EVENT_BY_ID];

export const eventDetailsReducer = (
    state: IAsyncData<IEventFullModel> = getInitialState(),
    action: IReduxAction<IEventFullModel>,
): IAsyncData<IEventFullModel> => {
    const {originalType, type} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer<IEventFullModel, IEventFullModel>(
            originalType,
            state,
        )(state, action);
    }

    if (type === CLEAR_EVENT_DATA) {
        return getInitialState();
    }

    return state;
};
