import React from 'react';
import {connect} from 'react-redux';
import {
    Avatar,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Link,
    Snackbar,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import i18n from 'i18next';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {AuthActions} from 'src/modules/auth/actions/AuthActions';
import {IUserModel} from 'src/modules/auth/models';
import {AuthService} from 'src/modules/auth/service/AuthService';
import {Redirect, Link as RouteLink} from 'react-router-dom';

interface IStateProps {
    userData: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    login: string;
    password: string;
}

class LoginPage extends React.Component<TProps, IState> {
    state: IState = {
        login: '',
        password: '',
    };

    handleLogin = (e) => {
        const {login, password} = this.state;
        e.preventDefault();

        this.props.actions.login({
            login,
            password,
        });
    };

    handleLoginChange = (event) => {
        this.setState({login: event.target.value});
    };
    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    };

    render() {
        const {login, password} = this.state;
        const {userData} = this.props;
        const popupVisible = userData.status === EStatusCodes.FAIL;
        const isPending = userData.status === EStatusCodes.PENDING;

        if (isPending) {
            return <LoadingOverlay open />;
        }

        if (userData.status === EStatusCodes.SUCCESS) {
            return <Redirect to="/" />;
        }

        return (
            <React.Fragment>
                <Container component="main" maxWidth="xs">
                    <Avatar>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {i18n.t('Auth:login.title')}
                    </Typography>
                    <form onSubmit={this.handleLogin} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label={i18n.t('Auth:login.loginPlaceholder')}
                            name="login"
                            autoComplete="login"
                            value={login}
                            onChange={this.handleLoginChange}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={i18n.t('Auth:login.passwordPlaceholder')}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={this.handlePasswordChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isPending}
                        >
                            {i18n.t('Auth:login.loginButton')}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <RouteLink to="/forgot">
                                    <Link component="span">
                                        {i18n.t('Auth:login.forgot')}
                                    </Link>
                                </RouteLink>
                            </Grid>
                            <Grid item>
                                <RouteLink to="/signup">
                                    <Link component="span">
                                        {i18n.t('Auth:login.signup')}
                                    </Link>
                                </RouteLink>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
                {popupVisible && ( //TODO: сделать общий интерфейс для показа попапов.
                    <Snackbar
                        open
                        message={userData.error.message}
                        autoHideDuration={3000}
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    userData: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export {connected as LoginPage};
