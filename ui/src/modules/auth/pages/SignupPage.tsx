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
import {BuildingsAutocomplete} from 'Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'Modules/buildings/models';
import {IUserModel} from 'Modules/users/models';

interface IStateProps {
    userData: IAsyncData<IUserModel>;
    buildingsData: IAsyncData<IBuildingModel[]>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    login: string;
    password: string;
    passwordConfirm: string;
    email: string;
    building: IBuildingModel;
}

class SignupPage extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            passwordConfirm: '',
            email: '',
            building: null,
        };
    }

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
        const {login, password, passwordConfirm, email, building} = this.state;
        e.preventDefault();

        this.props.actions.signUp({
            login,
            password,
            passwordConfirm,
            email,
            building: building?._id,
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

    /**
     * Обработчик выбора здания.
     *
     * @param {IBuildingModel} building Выбранное здание.
     */
    handleBuildingSelect = (building: IBuildingModel) => {
        this.setState({
            building,
        });
    };

    render() {
        const {login, password, passwordConfirm, email} = this.state;
        const {userData, buildingsData} = this.props;
        const buildingsIsLoading =
            buildingsData.status === EStatusCodes.PENDING;
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
                    {i18n.t('Auth:signup.title')}
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label={i18n.t('Auth:signup.loginPlaceholder')}
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
                        label={i18n.t('Auth:signup.passwordPlaceholder')}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={this.createFieldChangeHandler('password')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="passwordConfirm"
                        label={i18n.t('Auth:signup.passwordConfirmPlaceholder')}
                        type="password"
                        id="passwordConfirm"
                        autoComplete="passwordConfirm"
                        value={passwordConfirm}
                        onChange={this.createFieldChangeHandler(
                            'passwordConfirm',
                        )}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label={i18n.t('Auth:signup.emailPlaceholder')}
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={this.createFieldChangeHandler('email')}
                    />
                    <BuildingsAutocomplete
                        onSelect={this.handleBuildingSelect}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={buildingsIsLoading || isPending}
                    >
                        {i18n.t('Auth:signup.signupButton')}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <RouteLink to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                <Link component="span">
                                    {i18n.t('Auth:signup.loginText')}
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
    buildingsData: state.buildings,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(SignupPage);

export {connected as SignupPage};
