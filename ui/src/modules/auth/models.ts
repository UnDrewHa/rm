import {IAsyncData} from 'Core/reducer/model';

/**
 * Данные для входа.
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
