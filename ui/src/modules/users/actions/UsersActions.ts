import i18n from 'i18next';
import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {IDeleteMultipleItems} from 'Core/models';
import {ISignupData} from 'Modules/auth/models';
import {
    CHANGE_OWN_PASSWORD,
    CREATE_USER,
    DELETE_ME,
    DELETE_USERS,
    GET_USER_INFO,
    GET_USERS,
    TOGGLE_FAVOURITE,
    UPDATE_ME,
    UPDATE_USER,
} from 'Modules/users/actions/actionTypes';
import {ICheckPasswordData, IUpdateUser} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';

/**
 * Сервис модуля Users.
 */
export class UsersActions {
    constructor(private service: UsersService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Найти бронирования переговорных комнат.
     */
    getAll() {
        return dispatchAsync(this.dispatch, GET_USERS, this.service.getAll());
    }

    /**
     * Получить данные пользователя.
     */
    getUserInfo() {
        return dispatchAsync(
            this.dispatch,
            GET_USER_INFO,
            this.service.getUserInfo(),
        );
    }

    /**
     * Создать бронирование.
     *
     * @param {ISignupData} data Данные для создания.
     */
    create(data: ISignupData) {
        return dispatchAsync(
            this.dispatch,
            CREATE_USER,
            this.service.create(data),
        );
    }

    /**
     * Обновить бронирование.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    update(data: IUpdateUser) {
        return dispatchAsync(
            this.dispatch,
            UPDATE_USER,
            this.service.update(data),
        );
    }

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return dispatchAsync(
            this.dispatch,
            DELETE_USERS,
            this.service.delete(data),
        );
    }

    /**
     * Обновить пароль пользователя.
     *
     * @param {ICheckPasswordData} data Данные для обновления.
     */
    changePassword(data: ICheckPasswordData) {
        return dispatchAsync(
            this.dispatch,
            CHANGE_OWN_PASSWORD,
            this.service.changePassword(data),
        );
    }

    /**
     * Обновить пользователя.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    updateMe(data: IUpdateUser) {
        return dispatchAsync(
            this.dispatch,
            UPDATE_ME,
            this.service.updateMe(data),
        )
            .then((_) => {
                InterfaceAction.notify(
                    i18n.t('Users:profile.updateSuccess'),
                    'success',
                );
            })
            .catch((error) => {
                InterfaceAction.notify(
                    error?.error?.message ||
                        i18n.t('Users:profile.updateError'),
                    'error',
                );
            });
    }

    /**
     * Удалить пользователя.
     *
     * @param {ICheckPasswordData} data Данные для удаления.
     */
    deleteMe(data: ICheckPasswordData) {
        return dispatchAsync(
            this.dispatch,
            DELETE_ME,
            this.service.deleteMe(data),
        );
    }

    /**
     * Добавить в избранное переговорную комнату.
     */
    toggleFavourite(roomId: string, type: string) {
        return dispatchAsync(
            this.dispatch,
            TOGGLE_FAVOURITE,
            this.service.toggleFavourite({roomId, type}),
        );
    }
}
