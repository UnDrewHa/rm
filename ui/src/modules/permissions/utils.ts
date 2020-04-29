import {includes, isEmpty} from 'lodash-es';
import {ERoles} from 'Modules/permissions/enums';
import {IUserModel} from 'Modules/users/models';

export const checkAccess = (actions: string[], permissions: string[]) => {
    return !isEmpty(actions.filter((action) => includes(permissions, action)));
};

export const checkRole = (role: ERoles, user: IUserModel) => {
    return user.role === role;
};
