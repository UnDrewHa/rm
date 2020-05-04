import {combineReducers} from 'redux';
import {roomsListReducer} from 'src/Modules/rooms/reducers/roomsListReducer';
import {roomDetailsReducer} from 'src/Modules/rooms/reducers/roomDetailsReducer';

export const roomsRootReducer = combineReducers({
    list: roomsListReducer,
    details: roomDetailsReducer,
});
