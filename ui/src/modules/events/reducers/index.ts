import {eventsListReducer} from 'modules/events/reducers/eventsListReducer';
import {eventDetailsReducer} from 'modules/events/reducers/eventDetailsReducer';
import {combineReducers} from 'redux';

export const eventsRootReducer = combineReducers({
    list: eventsListReducer,
    details: eventDetailsReducer,
});
