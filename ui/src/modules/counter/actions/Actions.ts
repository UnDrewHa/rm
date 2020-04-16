import {DECREMENT, INCREMENT} from './actionTypes';

export class CounterActions {
    dispatch: any = null;

    constructor(dispatch: any) {
        this.dispatch = dispatch;
    }

    increment() {
        this.dispatch({
            type: INCREMENT,
        });
    }

    decrement() {
        this.dispatch({
            type: DECREMENT,
        });
    }
}
