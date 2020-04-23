import {Dispatch} from 'redux';
import {dispatchAsync} from 'Core/actions/utils';
import {IDeleteMultipleItems} from 'Core/models';
import {
    CREATE_ROOM,
    DELETE_ROOMS,
    FIND_ROOMS,
    GET_ROOM_BY_ID,
    UPDATE_ROOM,
} from 'Modules/rooms/actions/actionTypes';
import {
    IGetAllRoomsData,
    IRoomCreateModel,
    IRoomModel,
} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';

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
    find(data: IGetAllRoomsData) {
        return dispatchAsync(
            this.dispatch,
            FIND_ROOMS,
            this.service.find(data),
        );
    }

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById(id: string) {
        return dispatchAsync(
            this.dispatch,
            GET_ROOM_BY_ID,
            this.service.getById(id),
        );
    }

    /**
     * Создать бронирование.
     *
     * @param {IRoomCreateModel} data Данные для создания.
     */
    create(data: IRoomCreateModel) {
        return dispatchAsync(
            this.dispatch,
            CREATE_ROOM,
            this.service.create(data),
        );
    }

    /**
     * Обновить бронирование.
     *
     * @param {IRoomModel} data Данные для обновления.
     */
    update(data: IRoomModel) {
        return dispatchAsync(
            this.dispatch,
            UPDATE_ROOM,
            this.service.update(data),
        );
    }

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return dispatchAsync(
            this.dispatch,
            DELETE_ROOMS,
            this.service.delete(data),
        );
    }
}
