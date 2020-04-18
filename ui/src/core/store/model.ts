import {
    IMappedResetPasswordStore,
    IMappedUserStore,
} from 'src/modules/auth/models';
import {IMappedBuildingsStore} from 'src/modules/buildings/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore;
