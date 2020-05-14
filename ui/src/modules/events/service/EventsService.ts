import {axios} from 'core/axios';
import {IDataResponse, IDeleteMultipleItems} from 'core/models';
import {
    IEventCreateModel,
    IEventModel,
    IGetAllEventsData,
} from 'modules/events/models';

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
        return axios.post<IDataResponse<IEventModel[]>>(
            this.baseUrl + '/find',
            {data},
        );
    }

    /**
     * Найти бронирования переговорных комнат.
     *
     * @param {} data Данные для поиска.
     */
    getForApproving(data) {
        return axios.post<IDataResponse<IEventModel[]>>(
            this.baseUrl + '/approving',
            {data},
        );
    }

    approve(data: IDeleteMultipleItems) {
        return axios.post(this.baseUrl + '/approve', data);
    }

    refuse(data: IDeleteMultipleItems) {
        return axios.post(this.baseUrl + '/refuse', data);
    }

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById(id: string) {
        return axios.get<IDataResponse<IEventModel>>(this.baseUrl + '/' + id);
    }

    /**
     * Создать бронирование.
     *
     * @param {IEventCreateModel} data Данные для создания.
     */
    create(data: IEventCreateModel) {
        return axios.post<IDataResponse<IEventModel>>(this.baseUrl, {data});
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
