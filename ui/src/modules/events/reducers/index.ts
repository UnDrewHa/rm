import {combineReducers} from 'redux';
import {eventsListReducer} from 'src/Modules/events/reducers/eventsListReducer';
import {eventDetailsReducer} from 'src/Modules/events/reducers/eventDetailsReducer';

export const eventsRootReducer = combineReducers({
    list: eventsListReducer,
    details: eventDetailsReducer,
});
