import {axios} from 'core/axios';
import {IDataResponse} from 'core/models';
import {IUserModel} from 'modules/users/models';
import {
    IForgotPasswordData,
    ILoginData,
    IResetPasswordData,
    ISignupData,
} from '../models';

const BASE_URL = '/auth/';

/**
 * Сервис модуля Auth.
 */
export class AuthService {
    /**
     * Авторизоваться.
     *
     * @param {ILoginData} data Данные для входа.
     */
    login = (data: ILoginData) =>
        axios.post<IDataResponse<IUserModel>>(BASE_URL + 'login', {data});

    /**
     * Выйти из системы.
     */
    logout = () => axios.post<IDataResponse<null>>(BASE_URL + 'logout');

    /**
     * Зарегистрироваться.
     *
     * @param {ISignupData} data Данные для регистрации.
     */
    signup = (data: ISignupData) =>
        axios.post<IDataResponse<null>>(BASE_URL + 'signup', {data});

    /**
     * Запрос на отправку ссылки на восстановление пароля.
     *
     * @param {IForgotPasswordData} data Данные для восстановления.
     */
    forgot = (data: IForgotPasswordData) =>
        axios.post<IDataResponse<null>>(BASE_URL + 'forgot', {data});

    /**
     * Сбросить пароль, установив новый.
     *
     * @param {string} token Токен для сброса.
     * @param {IResetPasswordData} data Данные для сброса.
     */
    reset = (token: string, data: IResetPasswordData) =>
        axios.patch<IDataResponse<null>>(BASE_URL + 'reset/' + token, {
            data,
        });
}
