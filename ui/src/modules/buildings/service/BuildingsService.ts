import {axios} from 'src/core/axios';

const BASE_URL = '/buildings';

/**
 * Сервис модуля Buildings.
 */
export class BuildingsService {
    /**
     * Получить список всех зданий.
     */
    getAll = (): Promise<any> => axios.get(BASE_URL);
}
