import {axios} from 'src/Core/axios';
import {IDataResponse, IDeleteMultipleItems} from 'src/Core/models';
import {
    IBuildingCreateModel,
    IBuildingModel,
} from 'src/Modules/buildings/models';

/**
 * Сервис модуля Buildings.
 */
export class BuildingsService {
    constructor(context: string = '') {
        this.baseUrl = context + this.baseUrl;
    }

    baseUrl: string = '/buildings';

    /**
     * Получить список всех зданий.
     */
    getAll = (): Promise<any> => axios.get(this.baseUrl);

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById(id: string) {
        return axios.get<IDataResponse<IBuildingModel>>(
            this.baseUrl + '/' + id,
        );
    }

    /**
     * Создать здание.
     *
     * @param {IBuildingCreateModel} data Данные для создания.
     */
    create(data: IBuildingCreateModel) {
        return axios.post(this.baseUrl, {data});
    }

    /**
     * Обновить здание.
     *
     * @param {IBuildingModel} data Данные для обновления.
     */
    update(data: IBuildingModel) {
        return axios.patch(this.baseUrl, {data});
    }

    /**
     * Удалить здания.
     *
     * @param {IDeleteMultipleItems} data Данные для удаления.
     */
    delete(data: IDeleteMultipleItems) {
        return axios.delete(this.baseUrl, {data});
    }
}
