import {combineReducers} from 'redux';
import {TAppStore} from 'src/Core/store/model';
import {resetPasswordReducer} from 'src/Modules/auth/reducers/resetPasswordReducer';
import {buildingsRootReducer} from 'src/Modules/buildings/reducers';
import {eventsRootReducer} from 'src/Modules/events/reducers';
import {permissionsReducer} from 'src/Modules/permissions/reducers';
import {roomsRootReducer} from 'src/Modules/rooms/reducers';
import {usersRootReducer} from 'src/Modules/users/reducers';

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
