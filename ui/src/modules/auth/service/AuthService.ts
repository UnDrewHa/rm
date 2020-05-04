import {axios} from 'Core/axios';
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
    login = (data: ILoginData): Promise<any> =>
        axios.post(BASE_URL + 'login', {data});

    /**
     * Выйти из системы.
     */
    logout = (): Promise<any> => axios.post(BASE_URL + 'logout');

    /**
     * Зарегистрироваться.
     *
     * @param {ISignupData} data Данные для регистрации.
     */
    signup = (data: ISignupData): Promise<any> =>
        axios.post(BASE_URL + 'signup', {data});

    /**
     * Запрос на отправку ссылки на восстановление пароля.
     *
     * @param {IForgotPasswordData} data Данные для восстановления.
     */
    forgot = (data: IForgotPasswordData): Promise<any> =>
        axios.post(BASE_URL + 'forgot', {data});

    /**
     * Сбросить пароль, установив новый.
     *
     * @param {string} token Токен для сброса.
     * @param {IResetPasswordData} data Данные для сброса.
     */
    reset = (token: string, data: IResetPasswordData): Promise<any> =>
        axios.patch(BASE_URL + 'reset/' + token, {data});
}
