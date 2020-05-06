import {message} from 'antd';
import {dispatchAsync} from 'core/actions/utils';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {
    CLEAR_BUILDINGS_DATA,
    CREATE_BUILDING,
    DELETE_BUILDINGS,
    GET_BUILDING_BY_ID,
    GET_BUILDINGS,
    GET_FLOOR_DATA,
    UPDATE_BUILDING,
    UPDATE_FLOOR_DATA,
    UPLOAD_FLOOR_PLAN,
} from 'modules/buildings/actions/actionTypes';
import {BuildingsService} from 'modules/buildings/service/BuildingsService';
import {Dispatch} from 'redux';
import {
    IBuildingCreateModel,
    IBuildingModel,
    IGetFloorDataFilter,
    IUpdateFloorDataFilter,
} from '../models';

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
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById = (id: string) => {
        return dispatchAsync(
            this.dispatch,
            GET_BUILDING_BY_ID,
            this.service.getById(id),
        );
    };

    /**
     * Создать здание.
     *
     * @param {IBuildingCreateModel} data Данные для создания.
     */
    create = (data: IBuildingCreateModel) => {
        return dispatchAsync(
            this.dispatch,
            CREATE_BUILDING,
            this.service.create(data),
        )
            .then((res) => {
                message.success(i18n.t('Buildings:edit.createSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Buildings:edit.createError'),
                );
            });
    };

    /**
     * Обновить здание.
     *
     * @param {IBuildingModel} data Данные для обновления.
     */
    update = (data: IBuildingModel) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_BUILDING,
            this.service.update(data),
        )
            .then((res) => {
                message.success(i18n.t('Buildings:edit.updateSuccess'));
                InterfaceAction.redirect(ROUTER.MAIN.ADMIN.BUILDINGS.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Buildings:edit.updateError'),
                );
            });
    };

    /**
     * Удалить здания.
     *
     * @param {string[]} ids Данные для удаления.
     */
    delete = (ids: string[]) => {
        return dispatchAsync(
            this.dispatch,
            DELETE_BUILDINGS,
            this.service.delete({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Buildings:delete.deleteSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Buildings:delete.deleteError'),
                );
            });
    };

    getFloorData = (data: IGetFloorDataFilter) => {
        return dispatchAsync(
            this.dispatch,
            GET_FLOOR_DATA,
            this.service.getFloorData(data),
        );
    };

    uploadPlan = (data: FormData) => {
        return dispatchAsync(
            this.dispatch,
            UPLOAD_FLOOR_PLAN,
            this.service.uploadPlan(data),
        )
            .then((res) => {
                message.success(i18n.t('Buildings:upload.success'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Buildings:upload.error'),
                );
            });
    };

    updateFloorData = (data: IUpdateFloorDataFilter) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_FLOOR_DATA,
            this.service.updateFloorData(data),
        )
            .then((res) => {
                message.success(i18n.t('Buildings:updateFloor.success'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message ||
                        i18n.t('Buildings:updateFloor.error'),
                );
            });
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
