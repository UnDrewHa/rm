import {axios} from 'Core/axios';
import {IDeleteMultipleItems} from 'Core/models';
import {
    IGetAllRoomsData,
    IRoomCreateModel,
    IRoomModel,
} from 'Modules/rooms/models';

/**
 * Сервис модуля Rooms.
 */
export class RoomsService {
    constructor(context: string = '') {
        this.baseUrl = context + this.baseUrl;
    }

    baseUrl: string = '/rooms';

    /**
     * Найти переговорные комнаты.
     *
     * @param {IGetAllRoomsData} data Данные для поиска.
     */
    find(data: IGetAllRoomsData) {
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
     * Создать переговорную комнату.
     *
     * @param {IRoomCreateModel} data Данные для создания.
     */
    create(data: IRoomCreateModel) {
        return axios.post(this.baseUrl, {data});
    }

    /**
     * Обновить переговорную комнату.
     *
     * @param {IRoomModel} data Данные для обновления.
     */
    update(data: IRoomModel) {
        return axios.patch(this.baseUrl, {data});
    }

    /**
     * Удалить переговорные комнаты.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return axios.delete(this.baseUrl, {data});
    }
}
