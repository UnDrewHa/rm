import {
    Avatar,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import i18n from 'i18next';
import {memoize} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink, Redirect} from 'react-router-dom';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {AuthActions} from 'Modules/auth/actions/AuthActions';
import {AuthService} from 'Modules/auth/service/AuthService';
import {IUserModel} from 'Modules/users/models';

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

    componentDidUpdate(prevProps) {
        const {userData} = this.props;

        if (
            userData.status !== prevProps.userData.status &&
            userData.status === EStatusCodes.FAIL
        ) {
            InterfaceAction.notify(userData.error.message, 'error');
        }
    }

    /**
     * Обработчик отправки формы.
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {login, password} = this.state;

        this.props.actions.login({
            login,
            password,
        });
    };

    /**
     * Создать обработчик поля в state.
     */
    createFieldChangeHandler = memoize((field: keyof IState) => (event) => {
        this.setState<never>({
            [field]: event.target.value,
        });
    });

    render() {
        const {login, password} = this.state;
        const {userData} = this.props;
        const isPending = userData.status === EStatusCodes.PENDING;

        if (isPending) {
            return <LoadingOverlay open />;
        }

        if (userData.status === EStatusCodes.SUCCESS) {
            return <Redirect to={ROUTER.MAIN.FULL_PATH} />;
        }

        return (
            <Container component="main" maxWidth="xs">
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {i18n.t('Auth:login.title')}
                </Typography>
                <form onSubmit={this.handleSubmit}>
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
                        onChange={this.createFieldChangeHandler('login')}
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
                        onChange={this.createFieldChangeHandler('password')}
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
                            <RouteLink to={ROUTER.AUTH.FORGOT.FULL_PATH}>
                                <Link component="span">
                                    {i18n.t('Auth:login.forgot')}
                                </Link>
                            </RouteLink>
                        </Grid>
                        <Grid item>
                            <RouteLink to={ROUTER.AUTH.SIGNUP.FULL_PATH}>
                                <Link component="span">
                                    {i18n.t('Auth:login.signup')}
                                </Link>
                            </RouteLink>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    userData: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница входа.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export {connected as LoginPage};
