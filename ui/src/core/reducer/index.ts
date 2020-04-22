import {combineReducers} from 'redux';
import {TAppStore} from 'src/core/store/model';
import {resetPasswordReducer} from 'src/modules/auth/reducers/resetPasswordReducer';
import {eventsRootReducer} from 'src/modules/events/reducers';
import {roomsRootReducer} from 'src/modules/rooms/reducers';
import {userReducer} from 'src/modules/users/reducers/userReducer';
import {buildingsReducer} from 'src/modules/buildings/reducers';
import {permissionsReducer} from 'src/modules/permissions/reducers';

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
