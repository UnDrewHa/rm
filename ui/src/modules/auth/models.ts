import {IAsyncData} from 'src/core/reducer/model';
import {ERoles} from 'src/modules/auth/enums';
import {IBuildingModel} from 'src/modules/buildings/models';

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

/**
 * Интерфейс пользователя.
 */
export interface IUserModel {
    login: string;
    email: string;
    building: string;
    role?: ERoles;
    active?: boolean;
    passwordChangedAt?: string;
    phone?: string;
    favouriteRooms?: string[];
    photo?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
    passwordResetToken?: string;
    passwordResetExpires?: string;
}

export interface IMappedUserStore {
    user: IAsyncData<IUserModel>;
}

export interface IMappedResetPasswordStore {
    resetPassword: IAsyncData<null>;
}
