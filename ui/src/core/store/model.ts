import {IMappedResetPasswordStore} from 'Modules/auth/models';
import {IMappedBuildingsStore} from 'Modules/buildings/models';
import {IMappedEventsStore} from 'Modules/events/models';
import {IMappedPermissionsStore} from 'Modules/permissions/models';
import {IMappedRoomsStore} from 'Modules/rooms/models';
import {IMappedUserStore} from 'Modules/users/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore &
    IMappedPermissionsStore &
    IMappedRoomsStore &
    IMappedEventsStore;
