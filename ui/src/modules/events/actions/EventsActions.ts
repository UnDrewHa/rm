import {message} from 'antd';
import i18n from 'i18next';
import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {ROUTER} from 'Core/router/consts';
import {
    CREATE_EVENT,
    DELETE_EVENTS,
    FIND_EVENTS,
    GET_EVENT_BY_ID,
    UPDATE_EVENT,
} from 'Modules/events/actions/actionTypes';
import {
    IEventCreateModel,
    IEventModel,
    IGetAllEventsData,
} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';

/**
 * Сервис модуля Events.
 */
export class EventsActions {
    constructor(private service: EventsService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Найти бронирования переговорных комнат.
     *
     * @param {IGetAllEventsData} data Данные для поиска.
     */
    find = (data: IGetAllEventsData) => {
        return dispatchAsync(
            this.dispatch,
            FIND_EVENTS,
            this.service.find(data),
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
            GET_EVENT_BY_ID,
            this.service.getById(id),
        );
    };

    /**
     * Создать бронирование.
     *
     * @param {IEventCreateModel} data Данные для создания.
     */
    create = (data: IEventCreateModel) => {
        return dispatchAsync(
            this.dispatch,
            CREATE_EVENT,
            this.service.create(data),
        )
            .then((res) => {
                message.success(i18n.t('Events:edit.createSuccess'));
                InterfaceAction.redirect({
                    to: ROUTER.MAIN.EVENTS.DETAILS.FULL_PATH,
                    params: {
                        id: res.data.data._id,
                    },
                });
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Events:edit.createError'),
                );
            });
    };

    /**
     * Обновить бронирование.
     *
     * @param {IEventModel} data Данные для обновления.
     */
    update = (data: IEventModel) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_EVENT,
            this.service.update(data),
        )
            .then((res) => {
                message.success(i18n.t('Events:edit.updateSuccess'));
                InterfaceAction.redirect({
                    to: ROUTER.MAIN.EVENTS.DETAILS.FULL_PATH,
                    params: {
                        id: res.data.data._id,
                    },
                });
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Events:edit.updateError'),
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
            DELETE_EVENTS,
            this.service.delete({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Events:cancel.cancelSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Events:cancel.cancelError'),
                );
            });
    };
}
