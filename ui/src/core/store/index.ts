import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {rootReducer} from '../reducer';

//TODO: Настроить в зависимости от process.env.
export const store = createStore(
    rootReducer,
    applyMiddleware(thunk, createLogger()),
);
