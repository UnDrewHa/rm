import {
    IMappedResetPasswordStore,
    IMappedUserStore,
} from 'src/modules/auth/models';
import {IMappedBuildingsStore} from 'src/modules/buildings/models';
import {IMappedPermissionsStore} from 'src/modules/permissions/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore &
    IMappedPermissionsStore;
