import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from '../reducer';

let middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
    const {createLogger} = require('redux-logger');
    middleware = [...middleware, createLogger()];
}

export const store = createStore(rootReducer, applyMiddleware(...middleware));
