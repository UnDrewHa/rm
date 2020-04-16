import {combineReducers} from 'redux';
import {counterReducer} from '../../modules/counter/reducers';

export const rootReducer = combineReducers({
    counter: counterReducer,
});
