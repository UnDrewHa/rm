import {combineReducers} from 'redux';
import {TAppStore} from 'Core/store/model';
import {resetPasswordReducer} from 'Modules/auth/reducers/resetPasswordReducer';
import {buildingsRootReducer} from 'Modules/buildings/reducers';
import {eventsRootReducer} from 'Modules/events/reducers';
import {permissionsReducer} from 'Modules/permissions/reducers';
import {roomsRootReducer} from 'Modules/rooms/reducers';
import {usersRootReducer} from 'Modules/users/reducers';

/**
 * Корневой редюсер приложения.
 */
export const rootReducer = combineReducers<TAppStore>({
    users: usersRootReducer,
    buildings: buildingsRootReducer,
    resetPassword: resetPasswordReducer,
    permissions: permissionsReducer,
    rooms: roomsRootReducer,
    events: eventsRootReducer,
});
