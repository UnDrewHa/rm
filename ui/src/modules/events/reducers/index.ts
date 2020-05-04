import {combineReducers} from 'redux';
import {eventsListReducer} from 'modules/events/reducers/eventsListReducer';
import {eventDetailsReducer} from 'modules/events/reducers/eventDetailsReducer';

export const eventsRootReducer = combineReducers({
    list: eventsListReducer,
    details: eventDetailsReducer,
});
