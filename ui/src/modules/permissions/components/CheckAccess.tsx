import {connect} from 'react-redux';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {PermissionActions} from 'modules/permissions/actions/PermissionActions';
import {TPermissionsList} from 'modules/permissions/models';
import {PermissionService} from 'modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'modules/permissions/utils';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';
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
    userInfo: state.users.profile,
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
