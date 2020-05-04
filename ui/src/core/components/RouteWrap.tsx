import React from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {PermissionActions} from 'modules/permissions/actions/PermissionActions';
import {ERoles} from 'modules/permissions/enums';
import {TPermissionsList} from 'modules/permissions/models';
import {PermissionService} from 'modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'modules/permissions/utils';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';

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
