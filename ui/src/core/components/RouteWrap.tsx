import React from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {PermissionActions} from 'Modules/permissions/actions/PermissionActions';
import {ERoles} from 'Modules/permissions/enums';
import {TPermissionsList} from 'Modules/permissions/models';
import {PermissionService} from 'Modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'Modules/permissions/utils';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';

interface IOwnProps {
    role?: ERoles;
    actionsAccess?: string[];
    children: any;
    [a: string]: any;
}

interface IStateProps {
    permissions: IAsyncData<TPermissionsList>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    permissionActions: PermissionActions;
    userActions: UsersActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const RouteWrap = (props: TProps) => {
    const {
        userInfo,
        permissions,
        actionsAccess,
        role,
        children,
        ...rest
    } = props;
    const content = <Route {...rest}>{children}</Route>;

    if (
        !role &&
        actionsAccess &&
        checkAccess(actionsAccess, permissions.data)
    ) {
        return content;
    }

    if (!actionsAccess && role && checkRole(role, userInfo.data)) {
        return content;
    }

    return null;
};

const mapStateToProps = (state: TAppStore): IStateProps => ({
    permissions: state.permissions,
    userInfo: state.users.profile,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
    userActions: new UsersActions(new UsersService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(RouteWrap);

export {connected as RouteWrap};
