import {combineReducers} from 'redux';
import {roomsListReducer} from 'Modules/rooms/reducers/roomsListReducer';
import {roomDetailsReducer} from 'Modules/rooms/reducers/roomDetailsReducer';

export const roomsRootReducer = combineReducers({
    list: roomsListReducer,
    details: roomDetailsReducer,
});
