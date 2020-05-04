import {combineReducers} from 'redux';
import {roomsListReducer} from 'modules/rooms/reducers/roomsListReducer';
import {roomDetailsReducer} from 'modules/rooms/reducers/roomDetailsReducer';

export const roomsRootReducer = combineReducers({
    list: roomsListReducer,
    details: roomDetailsReducer,
});
