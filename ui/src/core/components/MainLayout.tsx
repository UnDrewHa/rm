import {LogoutOutlined} from '@ant-design/icons';
import {Layout, Menu, Tooltip} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, Switch} from 'react-router-dom';
import {LoadingOverlay} from 'src/Core/components/LoadingOverlay';
import {RouteWrap} from 'src/Core/components/RouteWrap';
import {IAsyncData} from 'src/Core/reducer/model';
import {ROUTER} from 'src/Core/router/consts';
import {TAppStore} from 'src/Core/store/model';
import {AdminLayoutPage} from 'src/Modules/admin/pages/AdminLayoutPage';
import {AuthActions} from 'src/Modules/auth/actions/AuthActions';
import {AuthService} from 'src/Modules/auth/service/AuthService';
import {EventDetailsPage} from 'src/Modules/events/pages/EventDetailsPage';
import {EventEditPage} from 'src/Modules/events/pages/EventEditPage';
import {UserEventsPage} from 'src/Modules/events/pages/UserEventsPage';
import {PermissionActions} from 'src/Modules/permissions/actions/PermissionActions';
import {
    EEventsActions,
    ERoles,
    ERoomsActions,
    EUsersActions,
} from 'src/Modules/permissions/enums';
import {TPermissionsList} from 'src/Modules/permissions/models';
import {PermissionService} from 'src/Modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'src/Modules/permissions/utils';
import {FavouritesRoomsPage} from 'src/Modules/rooms/pages/FavouritesRoomsPage';
import {RoomsListPage} from 'src/Modules/rooms/pages/RoomsListPage';
import {RoomSchedulePage} from 'src/Modules/rooms/pages/RoomSchedulePage';
import {UsersActions} from 'src/Modules/users/actions/UsersActions';
import {IUserModel} from 'src/Modules/users/models';
import {ProfilePage} from 'src/Modules/users/pages/ProfilePage';
import {UsersService} from 'src/Modules/users/service/UsersService';

const menuConfig = [
    {
        key: ROUTER.MAIN.FULL_PATH,
        label: () => i18n.t('menu.list'),
        accessActions: [ERoomsActions.GET_ALL],
    },
    {
        key: ROUTER.MAIN.EVENTS.USER_EVENTS.FULL_PATH,
        label: () => i18n.t('menu.ownEvents'),
        accessActions: [EEventsActions.GET_ALL],
    },
    {
        key: ROUTER.MAIN.ROOMS.FAVOURITES.FULL_PATH,
        label: () => i18n.t('menu.favourites'),
        accessActions: [ERoomsActions.GET_ALL],
    },
    {
        key: ROUTER.MAIN.PROFILE.FULL_PATH,
        label: () => i18n.t('menu.profile'),
        accessActions: [EUsersActions.UPDATE_ME],
    },
    {
        key: ROUTER.MAIN.ADMIN.FULL_PATH,
        label: () => i18n.t('menu.admin'),
        role: ERoles.ADMIN,
    },
];

interface IOwnProps {
    location: any;
}

interface IStateProps {
    permissions: IAsyncData<TPermissionsList>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    permissionActions: PermissionActions;
    userActions: UsersActions;
    authActions: AuthActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

interface IState {
    isLoading: boolean;
}

class MainLayout extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {permissionActions, userActions, userInfo} = props;

        this.state = {
            isLoading: true,
        };

        let promises = [permissionActions.getAll()];
        !userInfo.data && promises.push(userActions.getUserInfo());

        Promise.all(promises).then(() => {
            this.setState({
                isLoading: false,
            });
        });
    }

    handleLogout = () => {
        this.props.authActions.logout();
    };

    render() {
        const {location, permissions, userInfo} = this.props;
        const selectedKeys =
            location.pathname.indexOf(ROUTER.MAIN.ADMIN.FULL_PATH) === 0
                ? [ROUTER.MAIN.ADMIN.FULL_PATH]
                : [location.pathname];
        if (this.state.isLoading) {
            return <LoadingOverlay />;
        }

        return (
            <Layout className="main-layout">
                <Layout.Header className="main-layout__header">
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[ROUTER.MAIN.FULL_PATH]}
                        selectedKeys={selectedKeys}
                    >
                        {menuConfig.map((item) => {
                            if (
                                (item.accessActions &&
                                    !checkAccess(
                                        item.accessActions,
                                        permissions.data,
                                    )) ||
                                (item.role &&
                                    !checkRole(item.role, userInfo.data))
                            ) {
                                return null;
                            }

                            return (
                                <Menu.Item key={item.key}>
                                    <Link to={item.key}>{item.label()}</Link>
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                    <div className="logout-button" onClick={this.handleLogout}>
                        <Tooltip
                            placement="bottom"
                            title={i18n.t('Auth:logout.title')}
                        >
                            <LogoutOutlined />
                        </Tooltip>
                    </div>
                </Layout.Header>
                <Layout.Content className="main-layout__content">
                    <main className="main-layout__inner-content">
                        <Switch>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.FULL_PATH}
                            >
                                <AdminLayoutPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_ALL]}
                                path={ROUTER.MAIN.ROOMS.FAVOURITES.FULL_PATH}
                            >
                                <FavouritesRoomsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EUsersActions.UPDATE_ME]}
                                path={ROUTER.MAIN.PROFILE.FULL_PATH}
                            >
                                <ProfilePage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.GET_ALL]}
                                path={ROUTER.MAIN.EVENTS.USER_EVENTS.FULL_PATH}
                            >
                                <UserEventsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.CREATE]}
                                path={ROUTER.MAIN.EVENTS.CREATE.FULL_PATH}
                            >
                                <EventEditPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.GET_BY_ID]}
                                path={ROUTER.MAIN.EVENTS.DETAILS.FULL_PATH}
                            >
                                <EventDetailsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_BY_ID]}
                                path={ROUTER.MAIN.ROOMS.DETAILS.FULL_PATH}
                            >
                                <RoomSchedulePage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_ALL]}
                                path={ROUTER.MAIN.FULL_PATH}
                            >
                                <RoomsListPage />
                            </RouteWrap>
                        </Switch>
                    </main>
                </Layout.Content>
            </Layout>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    permissions: state.permissions,
    userInfo: state.users.profile,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
    userActions: new UsersActions(new UsersService(), dispatch),
    authActions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Основной лэйаут авторизованных пользователей.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(MainLayout),
);

export {connected as MainLayout};
