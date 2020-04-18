import {combineReducers} from 'redux';
import {resetPasswordReducer} from 'src/modules/auth/reducers/resetPasswordReducer';
import {userReducer} from 'src/modules/auth/reducers/userReducer';
import {buildingsReducer} from 'src/modules/buildings/reducers';

/**
 * Корневой редюсер приложения.
 */
export const rootReducer = combineReducers({
    user: userReducer,
    buildings: buildingsReducer,
    resetPassword: resetPasswordReducer,
});
