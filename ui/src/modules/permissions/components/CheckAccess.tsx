import {connect} from 'react-redux';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {PermissionActions} from 'Modules/permissions/actions/PermissionActions';
import {TPermissionsList} from 'Modules/permissions/models';
import {PermissionService} from 'Modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'Modules/permissions/utils';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';
import {ERoles} from '../enums';

interface IOwnProps {
    role?: ERoles;
    actions: string[];
    children: any;
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

const CheckAccess = (props: TProps) => {
    const {userInfo, permissions, actions, role} = props;
    const RIGHT_ROLE = !role || checkRole(role, userInfo.data);
    const RIGHT_ACTIONS = checkAccess(actions, permissions.data);

    if (!RIGHT_ROLE || !RIGHT_ACTIONS) {
        return null;
    }

    return props.children;
};

const mapStateToProps = (state: TAppStore): IStateProps => ({
    permissions: state.permissions,
    userInfo: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
    userActions: new UsersActions(new UsersService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(CheckAccess);

export {connected as CheckAccess};
