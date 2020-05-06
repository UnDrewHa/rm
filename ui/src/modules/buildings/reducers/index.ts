import {combineReducers} from 'redux';
import {buildingDetailsReducer} from './detailsReducer';
import {floorDataReducer} from './floorDataReducer';
import {buildingsListReducer} from './listReducer';

export const buildingsRootReducer = combineReducers({
    list: buildingsListReducer,
    details: buildingDetailsReducer,
    floorData: floorDataReducer,
})
