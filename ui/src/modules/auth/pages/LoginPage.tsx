import {memoize} from 'lodash-es';
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
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EEventNames} from 'src/core/EventEmitter/enums';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {ROUTER} from 'src/core/router/consts';
import {TAppStore} from 'src/core/store/model';
import {AuthActions} from 'src/modules/auth/actions/AuthActions';
import {AuthService} from 'src/modules/auth/service/AuthService';
import {Redirect, Link as RouteLink} from 'react-router-dom';
import {IUserModel} from 'src/modules/users/models';

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
            EventEmiter.emit(EEventNames.SHOW_NOTIFICATION, {
                message: userData.error.message,
                options: {
                    variant: 'error',
                },
            });
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
