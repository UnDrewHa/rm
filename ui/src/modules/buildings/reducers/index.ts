import {combineReducers} from 'redux';
import {buildingDetailsReducer} from './detailsReducer';
import {buildingsListReducer} from './listReducer';

export const buildingsRootReducer = combineReducers({
    list: buildingsListReducer,
    details: buildingDetailsReducer,
})
