import {axios} from 'src/core/axios';
import {ILoginData} from '../models';

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
        axios.post(BASE_URL + 'login', data);
}
