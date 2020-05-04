import {IMappedResetPasswordStore} from 'src/Modules/auth/models';
import {IMappedBuildingsStore} from 'src/Modules/buildings/models';
import {IMappedEventsStore} from 'src/Modules/events/models';
import {IMappedPermissionsStore} from 'src/Modules/permissions/models';
import {IMappedRoomsStore} from 'src/Modules/rooms/models';
import {IMappedUserStore} from 'src/Modules/users/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore &
    IMappedPermissionsStore &
    IMappedRoomsStore &
    IMappedEventsStore;
