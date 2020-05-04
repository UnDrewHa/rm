import {combineReducers} from 'redux';
import {profileReducer} from 'Modules/users/reducers/profileReducer';
import {usersListReducer} from 'Modules/users/reducers/usersListReducer';
import {userReducer} from 'Modules/users/reducers/userReducer';

export const usersRootReducer = combineReducers({
    list: usersListReducer,
    details: userReducer,
    profile: profileReducer,
});
