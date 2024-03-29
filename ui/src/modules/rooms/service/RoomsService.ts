import {axios} from 'core/axios';
import {IDeleteMultipleItems} from 'core/models';
import {IGetAllRoomsData} from 'modules/rooms/models';

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
     * @param {FormData} data Данные для создания.
     */
    create(data: FormData) {
        return axios({
            method: 'post',
            url: this.baseUrl,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'},
        });
    }

    /**
     * Обновить переговорную комнату.
     *
     * @param {FormData} data Данные для обновления.
     */
    update(data: FormData) {
        return axios({
            method: 'patch',
            url: this.baseUrl,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'},
        });
    }

    /**
     * Удалить переговорные комнаты.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return axios.delete(this.baseUrl, {data});
    }

    getQrCodes(data: IDeleteMultipleItems) {
        return axios.post(this.baseUrl + '/pdf', data);
    }
}
