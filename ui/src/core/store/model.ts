import {IMappedResetPasswordStore} from 'modules/auth/models';
import {IMappedBuildingsStore} from 'modules/buildings/models';
import {IMappedEventsStore} from 'modules/events/models';
import {IMappedPermissionsStore} from 'modules/permissions/models';
import {IMappedRoomsStore} from 'modules/rooms/models';
import {IMappedUserStore} from 'modules/users/models';

/**
 * Интерфейс хранилища приложения.
 */
export type TAppStore = IMappedUserStore &
    IMappedBuildingsStore &
    IMappedResetPasswordStore &
    IMappedPermissionsStore &
    IMappedRoomsStore &
    IMappedEventsStore;
