import {
    Avatar,
    Button,
    Container,
    TextField,
    Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import i18n from 'i18next';
import {memoize} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {AuthActions} from 'Modules/auth/actions/AuthActions';
import {AuthService} from 'Modules/auth/service/AuthService';

interface IProps {
    match: any;
}

interface IStateProps {
    resetPasswordData: IAsyncData<null>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IProps & IStateProps & IDispatchProps;

interface IState {
    password: string;
    passwordConfirm: string;
}

class ResetPasswordPage extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.props.actions.clear();

        this.state = {
            password: '',
            passwordConfirm: '',
        };
    }

    componentDidUpdate(prevProps) {
        const {resetPasswordData} = this.props;

        if (
            resetPasswordData.status !== prevProps.resetPasswordData.status &&
            resetPasswordData.status === EStatusCodes.FAIL
        ) {
            InterfaceAction.notify(resetPasswordData.error.message, 'error');
        }
    }

    /**
     * Обработчик отправки формы.
     */
    handleSubmit = (e) => {
        e.preventDefault();

        const {password, passwordConfirm} = this.state;
        const {match} = this.props;

        this.props.actions.reset(match.params.token, {
            password,
            passwordConfirm,
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
        const {password, passwordConfirm} = this.state;
        const {resetPasswordData} = this.props;
        const isPending = resetPasswordData.status === EStatusCodes.PENDING;

        if (isPending) {
            return <LoadingOverlay open />;
        }

        if (resetPasswordData.status === EStatusCodes.SUCCESS) {
            return <Redirect to={ROUTER.AUTH.LOGIN.FULL_PATH} />;
        }

        return (
            <Container component="main" maxWidth="xs">
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {i18n.t('Auth:reset.title')}
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={i18n.t('Auth:reset.passwordPlaceholder')}
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
                        label={i18n.t('Auth:reset.passwordConfirmPlaceholder')}
                        type="password"
                        id="passwordConfirm"
                        autoComplete="passwordConfirm"
                        value={passwordConfirm}
                        onChange={this.createFieldChangeHandler(
                            'passwordConfirm',
                        )}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                    >
                        {i18n.t('Auth:reset.saveButton')}
                    </Button>
                </form>
            </Container>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    resetPasswordData: state.resetPassword,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница сброса пароля, путем установки нового.
 */
const connected = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage),
);

export {connected as ResetPasswordPage};
