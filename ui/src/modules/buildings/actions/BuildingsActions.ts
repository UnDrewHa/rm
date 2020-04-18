import {Dispatch} from 'redux';
import {dispatchAsync} from 'src/core/actions/utils';
import {
    GET_BUILDINGS,
    CLEAR_BUILDINGS_DATA,
} from 'src/modules/buildings/actions/actionTypes';
import {BuildingsService} from 'src/modules/buildings/service/BuildingsService';

/**
 * Действия модуля Buildings.
 */
export class BuildingsActions {
    constructor(private service: BuildingsService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Получить список всех зданий.
     */
    getAll = () => {
        dispatchAsync(this.dispatch, GET_BUILDINGS, this.service.getAll());
    };

    /**
     * Очистить данные модуля.
     */
    clear = () => {
        this.dispatch({
            type: CLEAR_BUILDINGS_DATA,
        });
    };
}
