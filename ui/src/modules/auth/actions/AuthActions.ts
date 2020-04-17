import {Dispatch} from 'redux';
import {BEGIN, FAIL, SUCCESS} from 'src/core/actions/actionTypes';
import {LOGIN} from 'src/modules/auth/actions/actionTypes';
import {ILoginData} from '../models';
import {AuthService} from '../service/AuthService';

/**
 * Действия модуля Auth.
 */
export class AuthActions {
    constructor(service, dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    service: AuthService;
    dispatch: Dispatch;

    login = (data: ILoginData) => {
        this.dispatch({
            type: LOGIN + BEGIN,
        });

        this.service
            .login(data)
            .then((res) => {
                this.dispatch({
                    type: LOGIN + SUCCESS,
                    payload: res.data,
                });

                return res.data;
            })
            .catch((err) => {
                this.dispatch({
                    type: LOGIN + FAIL,
                    payload: err,
                });

                throw err;
            });
    };
}
