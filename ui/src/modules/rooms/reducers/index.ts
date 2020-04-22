import {combineReducers} from 'redux';
import {roomDetailsReducer} from 'src/modules/rooms/reducers/roomDetailsReducer';
import {roomsListReducer} from 'src/modules/rooms/reducers/roomsListReducer';

export const roomsRootReducer = combineReducers({
    list: roomsListReducer,
    details: roomDetailsReducer,
});
