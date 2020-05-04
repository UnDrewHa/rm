import {combineReducers} from 'redux';
import {TAppStore} from 'core/store/model';
import {resetPasswordReducer} from 'modules/auth/reducers/resetPasswordReducer';
import {buildingsRootReducer} from 'modules/buildings/reducers';
import {eventsRootReducer} from 'modules/events/reducers';
import {permissionsReducer} from 'modules/permissions/reducers';
import {roomsRootReducer} from 'modules/rooms/reducers';
import {usersRootReducer} from 'modules/users/reducers';

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
