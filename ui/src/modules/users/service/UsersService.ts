import {axios} from 'src/core/axios';
import {IDeleteMultipleItems} from 'src/core/models';
import {ISignupData} from 'src/modules/auth/models';
import {ICheckPasswordData, IUpdateUser} from 'src/modules/users/models';

/**
 * Сервис модуля Permissions.
 */
export class UsersService {
    constructor(context: string = '') {
        this.baseUrl = context + this.baseUrl;
    }

    baseUrl: string = '/users';

    /**
     * Получить весь список.
     */
    getAll() {
        return axios.get(this.baseUrl);
    }

    /**
     * Создать пользователя.
     *
     * @param {ISignupData} data Данные для создания.
     */
    create(data: ISignupData) {
        return axios.post(this.baseUrl, {data});
    }

    /**
     * Обновить пользователя.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    update(data: IUpdateUser) {
        return axios.patch(this.baseUrl, {data});
    }

    /**
     * Удалить пользователей.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return axios.delete(this.baseUrl, {data});
    }

    /**
     * Обновить пароль пользователя.
     *
     * @param {ICheckPasswordData} data Данные для обновления.
     */
    changePassword(data: ICheckPasswordData) {
        return axios.patch(this.baseUrl + '/change-password', {data});
    }

    /**
     * Обновить пользователя.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    updateMe(data: IUpdateUser) {
        return axios.patch(this.baseUrl + '/update-me', {data});
    }

    /**
     * Удалить пользователя.
     *
     * @param {ICheckPasswordData} data Данные для удаления.
     */
    deleteMe(data: ICheckPasswordData) {
        return axios.delete(this.baseUrl + '/delete-me', {data});
    }
}
