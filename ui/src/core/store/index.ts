import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from '../reducer';
import {createLogger} from 'redux-logger';

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk, createLogger()),
);
