import i18n from 'i18next';
import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {ROUTER} from 'Core/router/consts';
import {
    CLEAR_AUTH_DATA,
    LOGIN,
    RESET_PASSWORD,
    SIGNUP,
} from 'Modules/auth/actions/actionTypes';
import {
    IForgotPasswordData,
    ILoginData,
    IResetPasswordData,
    ISignupData,
} from '../models';
import {AuthService} from '../service/AuthService';

/**
 * Действия модуля Auth.
 */
export class AuthActions {
    constructor(private service: AuthService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Залогиниться.
     *
     * @param {ILoginData} data Данные для входа.
     */
    login = (data: ILoginData) => {
        dispatchAsync(this.dispatch, LOGIN, this.service.login(data))
            .then((_) => {
                InterfaceAction.redirect(ROUTER.MAIN.FULL_PATH);
            })
            .catch((error) => {
                InterfaceAction.notify(
                    error?.error?.message || i18n.t('Auth:login.loginError'),
                    'error',
                );
            });
    };

    /**
     * Зарегистрироваться.
     *
     * @param {ISignupData} data Данные для регистрации.
     */
    signUp = (data: ISignupData) => {
        dispatchAsync(this.dispatch, SIGNUP, this.service.signup(data))
            .then((_) => {
                InterfaceAction.notify(
                    i18n.t('Auth:signup.signupSuccess'),
                    'success',
                );
                InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);
            })
            .catch((error) => {
                InterfaceAction.notify(
                    error?.error?.message || i18n.t('Auth:signup.signupError'),
                    'error',
                );
            });
    };

    /**
     * Получить токен для сброса пароля.
     *
     * @param {IForgotPasswordData} data Данные для восстановления.
     */
    forgot = (data: IForgotPasswordData) => {
        dispatchAsync(this.dispatch, RESET_PASSWORD, this.service.forgot(data))
            .then((_) => {
                InterfaceAction.notify(
                    i18n.t('Auth:forgot.forgotSuccess'),
                    'success',
                );
            })
            .catch((error) => {
                InterfaceAction.notify(
                    error?.error?.message || i18n.t('Auth:forgot.forgotError'),
                    'error',
                );
            });
    };

    /**
     * Сбросить пароль, установив новый.
     *
     * @param {string} token Токен для сброса.
     * @param {IResetPasswordData} data Данные для сброса.
     */
    reset = (token: string, data: IResetPasswordData) => {
        dispatchAsync(
            this.dispatch,
            RESET_PASSWORD,
            this.service.reset(token, data),
        )
            .then((_) => {
                InterfaceAction.notify(
                    i18n.t('Auth:reset.resetSuccess'),
                    'success',
                );
                InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);
            })
            .catch((error) => {
                InterfaceAction.notify(
                    error?.error?.message || i18n.t('Auth:reset.resetError'),
                    'error',
                );
            });
    };

    /**
     * Сбросить данные модуля.
     */
    clear = () => {
        this.dispatch({
            type: CLEAR_AUTH_DATA,
        });
    };
}
