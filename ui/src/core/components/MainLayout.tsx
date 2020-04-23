import {
    AppBar,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
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
import {RoomsList} from 'Modules/rooms/pages/RoomsList';
import {RoomSchedulePage} from 'Modules/rooms/pages/RoomSchedulePage';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
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
            <Container maxWidth={false}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Photos
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path={ROUTER.MAIN.EVENTS.USER_EVENTS.FULL_PATH}>
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
                        <RoomsList />
                    </Route>
                </Switch>
            </Container>
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
