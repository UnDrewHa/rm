import {filter, includes, isEmpty} from 'lodash-es';
import {ERoles} from 'modules/permissions/enums';
import {IUserModel} from 'modules/users/models';

export const checkAccess = (actions: string[], permissions: string[]) => {
    return !isEmpty(filter(actions, (action) => includes(permissions, action)));
};

export const checkRole = (role: ERoles, user: IUserModel) => {
    return user?.role === role;
};
