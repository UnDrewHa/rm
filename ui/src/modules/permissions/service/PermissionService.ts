import {axios} from 'core/axios';

const BASE_URL = '/permissions';

/**
 * Сервис модуля Permissions.
 */
export class PermissionService {
    /**
     * Загрузить данные доступов.
     */
    getAll = (): Promise<any> => axios.get(BASE_URL);
}
