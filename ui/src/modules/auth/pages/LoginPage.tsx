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
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import i18n from 'i18next';
import {AuthActions} from 'src/modules/auth/actions/AuthActions';
import {AuthService} from 'src/modules/auth/service/AuthService';

interface IDispatchProps {
    actions: AuthActions;
}

interface IState {
    login: string;
    password: string;
    isLoggedIn: boolean;
}

class LoginPage extends React.Component<IDispatchProps, IState> {
    state: IState = {
        login: '',
        password: '',
        isLoggedIn: false,
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

        return (
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
                    >
                        {i18n.t('Auth:login.loginButton')}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                {i18n.t('Auth:login.forgot')}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {i18n.t('Auth:login.signup')}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}

const connected = connect(
    null,
    (dispatch): IDispatchProps => ({
        actions: new AuthActions(new AuthService(), dispatch),
    }),
)(LoginPage);

export {connected as LoginPage};
