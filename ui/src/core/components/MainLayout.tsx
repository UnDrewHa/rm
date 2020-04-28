import {Layout, Menu} from 'antd';
import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventDetailsPage} from 'Modules/events/pages/EventDetailsPage';
import {EventEditPage} from 'Modules/events/pages/EventEditPage';
import {UserEventsPage} from 'Modules/events/pages/UserEventsPage';
import {PermissionActions} from 'Modules/permissions/actions/PermissionActions';
import {TPermissionsList} from 'Modules/permissions/models';
import {PermissionService} from 'Modules/permissions/service/PermissionService';
import {FavouritesRoomsPage} from 'Modules/rooms/pages/FavouritesRoomsPage';
import {RoomsListPage} from 'Modules/rooms/pages/RoomsListPage';
import {RoomSchedulePage} from 'Modules/rooms/pages/RoomSchedulePage';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {ProfileAvatar} from 'Modules/users/components/ProfileAvatar';
import {IUserModel} from 'Modules/users/models';
import {ProfilePage} from 'Modules/users/pages/ProfilePage';
import {UsersService} from 'Modules/users/service/UsersService';

interface IStateProps {
    permissions: IAsyncData<TPermissionsList>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    permissionActions: PermissionActions;
    userActions: UsersActions;
}

type TProps = IStateProps & IDispatchProps;

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
        if (this.state.isLoading) {
            return <LoadingOverlay open />;
        }

        return (
            <Layout className="main-layout">
                <Layout.Header className="main-layout__header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                    <ProfileAvatar />
                </Layout.Header>
                <Layout.Content className="main-layout__content">
                    <main className="main-layout__inner-content">
                        <Switch>
                            <Route path={ROUTER.MAIN.ROOMS.FAVOURITES.FULL_PATH}>
                                <FavouritesRoomsPage />
                            </Route>
                            <Route path={ROUTER.MAIN.PROFILE.FULL_PATH}>
                                <ProfilePage />
                            </Route>
                            <Route
                                path={ROUTER.MAIN.EVENTS.USER_EVENTS.FULL_PATH}
                            >
                                <UserEventsPage />
                            </Route>
                            <Route path={ROUTER.MAIN.EVENTS.CREATE.FULL_PATH}>
                                <EventEditPage />
                            </Route>
                            <Route path={ROUTER.MAIN.EVENTS.DETAILS.FULL_PATH}>
                                <EventDetailsPage />
                            </Route>
                            <Route path={ROUTER.MAIN.ROOMS.DETAILS.FULL_PATH}>
                                <RoomSchedulePage />
                            </Route>
                            <Route path={ROUTER.MAIN.FULL_PATH}>
                                <RoomsListPage />
                            </Route>
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
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(MainLayout);

export {connected as MainLayout};
