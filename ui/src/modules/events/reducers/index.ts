import {combineReducers} from 'redux';
import {eventDetailsReducer} from 'src/modules/events/reducers/eventDetailsReducer';
import {eventsListReducer} from 'src/modules/events/reducers/eventsListReducer';

export const eventsRootReducer = combineReducers({
    list: eventsListReducer,
    details: eventDetailsReducer,
});
