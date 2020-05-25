import {message} from 'antd';
import {dispatchAsync} from 'core/actions/utils';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {
    APPROVE_EVENT,
    CLEAR_EVENT_DATA,
    CREATE_EVENT,
    DELETE_EVENTS,
    FIND_EVENTS,
    GET_EVENT_BY_ID,
    REFUSE_EVENT,
    UPDATE_EVENT,
} from 'modules/events/actions/actionTypes';
import {
    IApprovingFilter,
    IEventCreateModel,
    IEventModel,
    IGetAllEventsData,
} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {Dispatch} from 'redux';

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

    getForApproving = (data: IApprovingFilter) => {
        return dispatchAsync(
            this.dispatch,
            FIND_EVENTS,
            this.service.getForApproving({filter: data}),
        );
    };

    approve(ids: string[]) {
        return dispatchAsync(
            this.dispatch,
            APPROVE_EVENT,
            this.service.approve({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Events:approve.success'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Events:approve.error'),
                );
            });
    }

    refuse(ids: string[]) {
        return dispatchAsync(
            this.dispatch,
            REFUSE_EVENT,
            this.service.refuse({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Events:refuse.success'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Events:refuse.error'),
                );
            });
    }

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

    clear = () => {
        this.dispatch({
            type: CLEAR_EVENT_DATA,
        });
    };
}
