import {Dispatch} from 'redux';
import {dispatchAsync} from 'src/Core/actions/utils';
import {
    CLEAR_PERMISSIONS,
    GET_PERMISSIONS,
} from 'src/Modules/permissions/actions/actionTypes';
import {PermissionService} from 'src/Modules/permissions/service/PermissionService';

/**
 * Действия модуля Permissions.
 */
export class PermissionActions {
    constructor(
        private service: PermissionService,
        private dispatch: Dispatch,
    ) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Загрузить данные доступов.
     */
    getAll = () => {
        return dispatchAsync(
            this.dispatch,
            GET_PERMISSIONS,
            this.service.getAll(),
        );
    };

    /**
     * Сбросить данные модуля.
     */
    clear = () => {
        this.dispatch({
            type: CLEAR_PERMISSIONS,
        });
    };
}
