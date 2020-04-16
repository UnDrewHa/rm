import {DECREMENT, INCREMENT} from '../actions/actionTypes';

export const getInitialState = () => 0;

export const counterReducer = (
    prevState = getInitialState(),
    action: {type: any},
) => {
    if (action.type === INCREMENT) {
        return prevState + 1;
    }

    if (action.type === DECREMENT) {
        return prevState - 1;
    }

    return prevState;
};
