import {combineReducers} from 'redux';
import {TAppStore} from 'Core/store/model';
import {resetPasswordReducer} from 'Modules/auth/reducers/resetPasswordReducer';
import {buildingsReducer} from 'Modules/buildings/reducers';
import {eventsRootReducer} from 'Modules/events/reducers';
import {permissionsReducer} from 'Modules/permissions/reducers';
import {roomsRootReducer} from 'Modules/rooms/reducers';
import {userReducer} from 'Modules/users/reducers/userReducer';

/**
 * Корневой редюсер приложения.
 */
export const rootReducer = combineReducers<TAppStore>({
    user: userReducer,
    buildings: buildingsReducer,
    resetPassword: resetPasswordReducer,
    permissions: permissionsReducer,
    rooms: roomsRootReducer,
    events: eventsRootReducer,
});
