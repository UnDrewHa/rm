import {axios} from 'Core/axios';
import {IDeleteMultipleItems} from 'Core/models';
import {
    IEventCreateModel,
    IEventModel,
    IGetAllEventsData,
} from 'Modules/events/models';

/**
 * Сервис модуля Events.
 */
export class EventsService {
    constructor(context: string = '') {
        this.baseUrl = context + this.baseUrl;
    }

    baseUrl: string = '/events';

    /**
     * Найти бронирования переговорных комнат.
     *
     * @param {IGetAllEventsData} data Данные для поиска.
     */
    find(data: IGetAllEventsData) {
        return axios.post(this.baseUrl + '/find', {data});
    }

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById(id: string) {
        return axios.get(this.baseUrl + '/' + id);
    }

    /**
     * Создать бронирование.
     *
     * @param {IEventCreateModel} data Данные для создания.
     */
    create(data: IEventCreateModel) {
        return axios.post(this.baseUrl, {data});
    }

    /**
     * Обновить бронирование.
     *
     * @param {IEventModel} data Данные для обновления.
     */
    update(data: IEventModel) {
        return axios.patch(this.baseUrl, {data});
    }

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return axios.delete(this.baseUrl, {data});
    }
}
