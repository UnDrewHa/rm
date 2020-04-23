import {combineReducers} from 'redux';
import {eventsListReducer} from 'Modules/events/reducers/eventsListReducer';
import {eventDetailsReducer} from 'Modules/events/reducers/eventDetailsReducer';

export const eventsRootReducer = combineReducers({
    list: eventsListReducer,
    details: eventDetailsReducer,
});
