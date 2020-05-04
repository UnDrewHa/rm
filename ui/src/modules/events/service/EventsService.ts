import {axios} from 'src/Core/axios';
import {IDataResponse, IDeleteMultipleItems} from 'src/Core/models';
import {
    IEventCreateModel,
    IEventModel,
    IGetAllEventsData,
} from 'src/Modules/events/models';

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
