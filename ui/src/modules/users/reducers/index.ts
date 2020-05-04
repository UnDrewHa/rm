import {combineReducers} from 'redux';
import {profileReducer} from 'src/Modules/users/reducers/profileReducer';
import {usersListReducer} from 'src/Modules/users/reducers/usersListReducer';
import {userReducer} from 'src/Modules/users/reducers/userReducer';

export const usersRootReducer = combineReducers({
    list: usersListReducer,
    details: userReducer,
    profile: profileReducer,
});
