import {axios} from 'src/Core/axios';
import {IDeleteMultipleItems} from 'src/Core/models';
import {
    IGetAllRoomsData,
    IRoomCreateModel,
    IRoomModel,
} from 'src/Modules/rooms/models';

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
     * Найти избранные переговорные комнаты.
     */
    getFavourite() {
        return axios.get(this.baseUrl + '/favourites');
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
