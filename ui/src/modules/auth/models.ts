import {IAsyncData} from 'core/reducer/model';

/**
 * Данные для входа.
 *
 * @prop {string} login.
 * @prop {string} password.
 */
export interface ILoginData {
    login: string;
    password: string;
}

/**
 * Данные для регистрации.
 */
export interface ISignupData {
    login: string;
    password: string;
    passwordConfirm: string;
    email: string;
    building: string;
}

/**
 * Данные для получения токена на сброс пароля.
 *
 * @prop {string} email.
 */
export interface IForgotPasswordData {
    email: string;
}

/**
 * Данные для сброса пароля.
 */
export interface IResetPasswordData {
    password: string;
    passwordConfirm: string;
}

export interface IMappedResetPasswordStore {
    resetPassword: IAsyncData<null>;
}
