import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from '../reducer';
import {createLogger} from 'redux-logger';

//TODO: Настроить в зависимости от process.env.
export const store = createStore(
    rootReducer,
    applyMiddleware(thunk, createLogger()),
);
