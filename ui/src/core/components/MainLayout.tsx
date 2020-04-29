import {Layout, Menu} from 'antd';
import i18n from 'i18next';
import {AdminLayoutPage} from 'Modules/admin/pages/AdminLayoutPage';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, Switch} from 'react-router-dom';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {RouteWrap} from 'Core/components/RouteWrap';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventDetailsPage} from 'Modules/events/pages/EventDetailsPage';
import {EventEditPage} from 'Modules/events/pages/EventEditPage';
import {UserEventsPage} from 'Modules/events/pages/UserEventsPage';
import {PermissionActions} from 'Modules/permissions/actions/PermissionActions';
import {
    EEventsActions,
    ERoles,
    ERoomsActions,
    EUsersActions,
} from 'Modules/permissions/enums';
import {TPermissionsList} from 'Modules/permissions/models';
import {PermissionService} from 'Modules/permissions/service/PermissionService';
import {checkAccess, checkRole} from 'Modules/permissions/utils';
import {FavouritesRoomsPage} from 'Modules/rooms/pages/FavouritesRoomsPage';
import {RoomsListPage} from 'Modules/rooms/pages/RoomsListPage';
import {RoomSchedulePage} from 'Modules/rooms/pages/RoomSchedulePage';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {ProfilePage} from 'Modules/users/pages/ProfilePage';
import {UsersService} from 'Modules/users/service/UsersService';

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

    render() {
        const {location, permissions, userInfo} = this.props;
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
                        selectedKeys={[location.pathname]}
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
    userInfo: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
    userActions: new UsersActions(new UsersService(), dispatch),
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
