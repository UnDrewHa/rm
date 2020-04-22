import {IMappedResetPasswordStore} from 'src/modules/auth/models';
import {IMappedBuildingsStore} from 'src/modules/buildings/models';
import {IMappedEventsStore} from 'src/modules/events/models';
import {IMappedPermissionsStore} from 'src/modules/permissions/models';
import {IMappedRoomsStore} from 'src/modules/rooms/models';
import {IMappedUserStore} from 'src/modules/users/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore &
    IMappedPermissionsStore &
    IMappedRoomsStore &
    IMappedEventsStore;
