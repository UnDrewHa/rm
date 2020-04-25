import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
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
        );
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
        );
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
        );
    };
}
