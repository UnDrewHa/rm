import {combineReducers} from 'redux';
import {profileReducer} from 'modules/users/reducers/profileReducer';
import {usersListReducer} from 'modules/users/reducers/usersListReducer';
import {userReducer} from 'modules/users/reducers/userReducer';

export const usersRootReducer = combineReducers({
    list: usersListReducer,
    details: userReducer,
    profile: profileReducer,
});
