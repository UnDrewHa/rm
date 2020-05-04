import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData, IReduxAction} from 'core/reducer/model';
import {createAsyncDataReducer} from 'core/reducer/utils';
import {
    CREATE_EVENT,
    GET_EVENT_BY_ID,
} from 'modules/events/actions/actionTypes';
import {IEventModel} from 'modules/events/models';

const getInitialState = (): IAsyncData<IEventModel> => ({
    status: EStatusCodes.IDLE,
    data: null,
    error: null,
});

const asyncActions = [CREATE_EVENT, GET_EVENT_BY_ID];

export const eventDetailsReducer = (
    state: IAsyncData<IEventModel> = getInitialState(),
    action: IReduxAction<IEventModel>,
): IAsyncData<IEventModel> => {
    const {originalType} = action;

    if (asyncActions.includes(originalType)) {
        return createAsyncDataReducer<IEventModel, IEventModel>(
            originalType,
            state,
        )(state, action);
    }

    return state;
};
