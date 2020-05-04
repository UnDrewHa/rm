import {message} from 'antd';
import i18n from 'i18next';
import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {ROUTER} from 'Core/router/consts';
import {ISignupData} from 'Modules/auth/models';
import {
    CHANGE_OWN_PASSWORD,
    CLEAR_USERS_DATA,
    CREATE_USER,
    DELETE_ME,
    DELETE_USERS,
    FIND_USERS,
    GET_USER_BY_ID,
    GET_USER_INFO,
    TOGGLE_FAVOURITE,
    UPDATE_ME,
    UPDATE_USER,
} from 'Modules/users/actions/actionTypes';
import {
    ICheckPasswordData,
    IUpdateUser,
    IUserFilterModel,
} from 'Modules/users/models';
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
    find = (filter: IUserFilterModel) => {
        return dispatchAsync(
            this.dispatch,
            FIND_USERS,
            this.service.find({filter}),
        );
    };

    /**
     * Получить данные пользователя.
     */
    getUserInfo = () => {
        return dispatchAsync(
            this.dispatch,
            GET_USER_INFO,
            this.service.getUserInfo(),
        );
    };

    /**
     * Получить данные пользователя.
     */
    getById = (id: string) => {
        return dispatchAsync(
            this.dispatch,
            GET_USER_BY_ID,
            this.service.getById(id),
        );
    };

    /**
     * Создать бронирование.
     *
     * @param {ISignupData} data Данные для создания.
     */
    create = (data: ISignupData) => {
        return dispatchAsync(
            this.dispatch,
            CREATE_USER,
            this.service.create(data),
        )
            .then((res) => {
                message.success(i18n.t('Users:edit.createSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Users:edit.createError'),
                );
            });
    };

    /**
     * Обновить бронирование.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    update = (data: IUpdateUser) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_USER,
            this.service.update(data),
        )
            .then((res) => {
                message.success(i18n.t('Users:edit.updateSuccess'));
                InterfaceAction.redirect(ROUTER.MAIN.ADMIN.USERS.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Users:edit.updateError'),
                );
            });
    };

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {string[]} ids Данные для удаления.
     */
    delete = (ids: string[]) => {
        return dispatchAsync(
            this.dispatch,
            DELETE_USERS,
            this.service.delete({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Users:delete.deleteSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Users:delete.deleteError'),
                );
            });
    };

    /**
     * Обновить пароль пользователя.
     *
     * @param {ICheckPasswordData} data Данные для обновления.
     */
    changePassword = (data: ICheckPasswordData) => {
        return dispatchAsync(
            this.dispatch,
            CHANGE_OWN_PASSWORD,
            this.service.changePassword(data),
        );
    };

    /**
     * Обновить пользователя.
     *
     * @param {IUpdateUser} data Данные для обновления.
     */
    updateMe = (data: IUpdateUser) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_ME,
            this.service.updateMe(data),
        )
            .then((_) => {
                message.success(i18n.t('Users:profile.updateSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Users:profile.updateError'),
                );
            });
    };

    /**
     * Удалить пользователя.
     *
     * @param {ICheckPasswordData} data Данные для удаления.
     */
    deleteMe = (data: ICheckPasswordData) => {
        return dispatchAsync(
            this.dispatch,
            DELETE_ME,
            this.service.deleteMe(data),
        );
    };

    /**
     * Добавить в избранное переговорную комнату.
     */
    toggleFavourite = (roomId: string, type: string) => {
        return dispatchAsync(
            this.dispatch,
            TOGGLE_FAVOURITE,
            this.service.toggleFavourite({roomId, type}),
        );
    };

    /**
     * Очистить стор.
     */
    clear() {
        this.dispatch({
            type: CLEAR_USERS_DATA,
        });
    }
}
