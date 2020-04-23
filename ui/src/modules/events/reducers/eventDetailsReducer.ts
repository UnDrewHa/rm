import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData, IReduxAction} from 'Core/reducer/model';
import {createAsyncDataReducer} from 'Core/reducer/utils';
import {
    CREATE_EVENT,
    GET_EVENT_BY_ID,
} from 'Modules/events/actions/actionTypes';
import {IEventModel} from 'Modules/events/models';

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
