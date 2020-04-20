import {memoize} from 'lodash-es';
import {
    Avatar,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
    LinearProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Autocomplete} from '@material-ui/lab';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink, Redirect} from 'react-router-dom';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EEventNames} from 'src/core/EventEmitter/enums';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {ROUTER} from 'src/core/router/consts';
import {TAppStore} from 'src/core/store/model';
import {AuthActions} from 'src/modules/auth/actions/AuthActions';
import {IUserModel} from 'src/modules/auth/models';
import {AuthService} from 'src/modules/auth/service/AuthService';
import {BuildingsActions} from 'src/modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'src/modules/buildings/models';
import {BuildingsService} from 'src/modules/buildings/service/BuildingsService';

interface IStateProps {
    userData: IAsyncData<IUserModel>;
    buildingsData: IAsyncData<IBuildingModel[]>;
}

interface IDispatchProps {
    actions: AuthActions;
    buildingsActions: BuildingsActions;
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

        props.buildingsActions.getAll();
    }

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
     * @param event Объект события.
     * @param {IBuildingModel} building Выбранное здание.
     */
    handleBuildingSelect = (event, building: IBuildingModel) => {
        this.setState({
            building,
        });
    };

    render() {
        const {login, password, passwordConfirm, email, building} = this.state;
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
                    <Autocomplete
                        id="building"
                        options={buildingsData.data}
                        getOptionLabel={(item) => item.address}
                        onChange={this.handleBuildingSelect}
                        value={building}
                        disabled={buildingsIsLoading}
                        disabledItemsFocusable={buildingsIsLoading}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label={i18n.t(
                                        'Auth:signup.buildingPlaceholder',
                                    )}
                                    variant="outlined"
                                />
                            );
                        }}
                    />
                    {buildingsIsLoading && <LinearProgress />}
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
                            <RouteLink to="/login">
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
    buildingsActions: new BuildingsActions(new BuildingsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(SignupPage);

export {connected as SignupPage};
