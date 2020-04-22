import React from 'react';
import {connect} from 'react-redux';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {ROUTER} from 'src/core/router/consts';
import {Route, Switch} from 'react-router-dom';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {PermissionActions} from 'src/modules/permissions/actions/PermissionActions';
import {TPermissionsList} from 'src/modules/permissions/models';
import {PermissionService} from 'src/modules/permissions/service/PermissionService';
import {
    AppBar,
    Container,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {RoomSchedulePage} from 'src/modules/rooms/pages/RoomSchedulePage';
import {RoomsList} from 'src/modules/rooms/pages/RoomsList';

interface IStateProps {
    permissions: IAsyncData<TPermissionsList>;
}

interface IDispatchProps {
    permissionActions: PermissionActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    isLoading: boolean;
}

class MainLayout extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };

        props.permissionActions.getAll().then(() => {
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
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
});

/**
 * Основной лэйаут авторизованных пользователей.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(MainLayout);

export {connected as MainLayout};
