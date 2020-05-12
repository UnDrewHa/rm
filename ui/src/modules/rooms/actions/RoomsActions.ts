import {message} from 'antd';
import {dispatchAsync} from 'core/actions/utils';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {
    CLEAR_ROOMS_DATA,
    CLEAR_ROOMS_DETAILS,
    CREATE_ROOM,
    DELETE_ROOMS,
    FIND_ROOMS,
    GET_QR_CODES,
    GET_ROOM_BY_ID,
    UPDATE_ROOM,
} from 'modules/rooms/actions/actionTypes';
import {IGetAllRoomsData} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import {Dispatch} from 'redux';

/**
 * Сервис модуля Events.
 */
export class RoomsActions {
    constructor(private service: RoomsService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Найти бронирования переговорных комнат.
     *
     * @param {IGetAllRoomsData} data Данные для поиска.
     */
    find = (data: IGetAllRoomsData) => {
        return dispatchAsync(
            this.dispatch,
            FIND_ROOMS,
            this.service.find(data),
        );
    };

    /**
     * Найти избранные переговорные комнаты.
     */
    getFavourite = () => {
        return dispatchAsync(
            this.dispatch,
            FIND_ROOMS,
            this.service.getFavourite(),
        );
    };

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById = (id: string) => {
        return dispatchAsync(
            this.dispatch,
            GET_ROOM_BY_ID,
            this.service.getById(id),
        );
    };

    /**
     * Создать бронирование.
     *
     * @param {FormData} data Данные для создания.
     */
    create = (data: FormData, onSuccess?) => {
        return dispatchAsync(
            this.dispatch,
            CREATE_ROOM,
            this.service.create(data),
            {onSuccess},
        )
            .then((res) => {
                message.success(i18n.t('Rooms:edit.createSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:edit.createError'),
                );
            });
    };

    /**
     * Обновить бронирование.
     *
     * @param {FormData} data Данные для обновления.
     */
    update = (data: FormData) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_ROOM,
            this.service.update(data),
        )
            .then((res) => {
                message.success(i18n.t('Rooms:edit.updateSuccess'));
                InterfaceAction.redirect(ROUTER.MAIN.ADMIN.ROOMS.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:edit.updateError'),
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
            DELETE_ROOMS,
            this.service.delete({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Rooms:delete.deleteSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:delete.deleteError'),
                );
            });
    };

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {string[]} ids Данные для удаления.
     */
    getQrCodes = (ids: string[], onSuccess) => {
        return dispatchAsync(
            this.dispatch,
            GET_QR_CODES,
            this.service.getQrCodes({data: {ids}}),
            {
                onSuccess,
            },
        );
    };

    /**
     * Очистить стор.
     */
    clear() {
        this.dispatch({
            type: CLEAR_ROOMS_DATA,
        });
    }

    /**
     * Очистить стор.
     */
    clearDetails() {
        this.dispatch({
            type: CLEAR_ROOMS_DETAILS,
        });
    }
}
