import {LogoutOutlined} from '@ant-design/icons';
import {Layout, Menu, Tooltip} from 'antd';
import {LoadingOverlay} from 'core/components/LoadingOverlay';
import {RouteWrap} from 'core/components/RouteWrap';
import {getErrorPage} from 'core/pages/404';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {AdminLayoutPage} from 'modules/admin/pages/AdminLayoutPage';
import {AuthActions} from 'modules/auth/actions/AuthActions';
import {AuthService} from 'modules/auth/service/AuthService';
import {EventDetailsPage} from 'modules/events/pages/EventDetailsPage';
import {EventEditPage} from 'modules/events/pages/EventEditPage';
import {UserEventsPage} from 'modules/events/pages/UserEventsPage';
import {PermissionActions} from 'modules/permissions/actions/PermissionActions';
import {
    EEventsActions,
    ERoles,
    ERoomsActions,
    EUsersActions,
} from 'modules/permissions/enums';
import {TPermissionsList} from 'modules/permissions/models';
import {PermissionService} from 'modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'modules/permissions/utils';
import {FavouritesRoomsPage} from 'modules/rooms/pages/FavouritesRoomsPage';
import {RoomsListPage} from 'modules/rooms/pages/RoomsListPage';
import {RoomsMapPage} from 'modules/rooms/pages/RoomsMapPage';
import {RoomSchedulePage} from 'modules/rooms/pages/RoomSchedulePage';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {ProfilePage} from 'modules/users/pages/ProfilePage';
import {UsersService} from 'modules/users/service/UsersService';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, Route, RouteChildrenProps, Switch} from 'react-router-dom';

const {FULL_PATH, MAP, EVENTS, ADMIN, PROFILE, ROOMS} = ROUTER.MAIN;

const menuConfig = [
    {
        key: FULL_PATH,
        label: () => i18n.t('menu.list'),
        accessActions: [ERoomsActions.GET_ALL],
    },
    {
        key: MAP.FULL_PATH,
        label: () => i18n.t('menu.map'),
        accessActions: [ERoomsActions.GET_ALL],
    },
    {
        key: EVENTS.USER_EVENTS.FULL_PATH,
        label: () => i18n.t('menu.ownEvents'),
        accessActions: [EEventsActions.GET_ALL],
    },
    {
        key: ROOMS.FAVOURITES.FULL_PATH,
        label: () => i18n.t('menu.favourites'),
        accessActions: [ERoomsActions.GET_ALL],
    },
    {
        key: PROFILE.FULL_PATH,
        label: () => i18n.t('menu.profile'),
        accessActions: [EUsersActions.UPDATE_ME],
    },
    {
        key: ADMIN.FULL_PATH,
        label: () => i18n.t('menu.admin'),
        role: ERoles.ADMIN,
    },
];

interface IOwnProps extends RouteChildrenProps {}

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
    hasErrors: boolean;
}

class MainLayout extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {permissionActions, userActions, userInfo} = props;

        this.state = {
            isLoading: true,
            hasErrors: false,
        };

        let promises = [permissionActions.getAll()];
        !userInfo.data && promises.push(userActions.getUserInfo());

        Promise.all(promises)
            .then(() => {
                this.setState({
                    isLoading: false,
                });
            })
            .catch((_) => {
                this.setState({
                    isLoading: false,
                    hasErrors: true,
                });
            });
    }

    handleLogout = () => {
        this.props.authActions.logout();
    };

    render() {
        const {hasErrors, isLoading} = this.state;
        const {location, permissions, userInfo} = this.props;
        const selectedKeys =
            location.pathname.indexOf(ADMIN.FULL_PATH) === 0
                ? [ADMIN.FULL_PATH]
                : [location.pathname];
        if (isLoading) {
            return <LoadingOverlay />;
        }

        if (hasErrors) {
            const ErrorData = getErrorPage(null, 500);
            return <ErrorData />;
        }

        return (
            <Layout className="main-layout">
                <Layout.Header className="main-layout__header">
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[FULL_PATH]}
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
                                path={ADMIN.FULL_PATH}
                            >
                                <AdminLayoutPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_ALL]}
                                path={ROOMS.FAVOURITES.FULL_PATH}
                            >
                                <FavouritesRoomsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EUsersActions.UPDATE_ME]}
                                path={PROFILE.FULL_PATH}
                            >
                                <ProfilePage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.GET_ALL]}
                                path={EVENTS.USER_EVENTS.FULL_PATH}
                            >
                                <UserEventsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.CREATE]}
                                path={EVENTS.CREATE.FULL_PATH}
                            >
                                <EventEditPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[EEventsActions.GET_BY_ID]}
                                path={EVENTS.DETAILS.FULL_PATH}
                            >
                                <EventDetailsPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_BY_ID]}
                                path={ROOMS.DETAILS.FULL_PATH}
                            >
                                <RoomSchedulePage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_ALL]}
                                path={MAP.FULL_PATH}
                            >
                                <RoomsMapPage />
                            </RouteWrap>
                            <RouteWrap
                                actionsAccess={[ERoomsActions.GET_ALL]}
                                path={FULL_PATH}
                                exact
                            >
                                <RoomsListPage />
                            </RouteWrap>
                            <Route component={getErrorPage(FULL_PATH, 404)} />
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
