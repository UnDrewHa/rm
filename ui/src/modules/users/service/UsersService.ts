import {axios} from 'src/Core/axios';
import {IDeleteMultipleItems, IFindBody} from 'src/Core/models';
import {ISignupData} from 'src/Modules/auth/models';
import {
    ICheckPasswordData,
    IUpdateUser,
    IUserFilterModel,
} from 'src/Modules/users/models';

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
    find(data: IFindBody<IUserFilterModel>) {
        return axios.post(this.baseUrl + '/find', {data});
    }

    /**
     * Получить данные пользователя.
     */
    getUserInfo() {
        return axios.get(this.baseUrl + '/info');
    }

    /**
     * Получить данные пользователя.
     */
    getById(id: string) {
        return axios.get(this.baseUrl + '/' + id);
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

    /**
     * Удалить пользователя.
     *
     * @param {ICheckPasswordData} data Данные для удаления.
     */
    toggleFavourite(data: {roomId: string; type: string}) {
        return axios.patch(this.baseUrl + '/toggle-favourite', {data});
    }
}
