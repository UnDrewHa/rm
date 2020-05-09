import {message} from 'antd';
import {dispatchAsync} from 'core/actions/utils';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {
    CLEAR_AUTH_DATA,
    LOGIN,
    RESET_PASSWORD,
    SIGNUP,
} from 'modules/auth/actions/actionTypes';
import {Dispatch} from 'redux';
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
                message.error(
                    error?.error?.message || i18n.t('Auth:login.loginError'),
                );
            });
    };

    /**
     * Выйти из системы.
     */
    logout = () => {
        this.service
            .logout()
            .then((_) => {
                InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Auth:logout.logoutError'),
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
                message.success(i18n.t('Auth:signup.signupSuccess'));
                InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Auth:signup.signupError'),
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
                message.success(i18n.t('Auth:forgot.forgotSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Auth:forgot.forgotError'),
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
                message.success(i18n.t('Auth:reset.resetSuccess'));
                InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Auth:reset.resetError'),
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
