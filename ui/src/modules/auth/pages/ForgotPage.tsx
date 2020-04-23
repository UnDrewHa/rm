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
import {Link as RouteLink} from 'react-router-dom';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {AuthActions} from 'Modules/auth/actions/AuthActions';
import {AuthService} from 'Modules/auth/service/AuthService';

interface IStateProps {
    resetPasswordData: IAsyncData<null>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    email: string;
}

/**
 * Страница запроса отправки ссылки на страницу сброса пароля.
 */
class ForgotPage extends React.Component<TProps, IState> {
    state: IState = {
        email: '',
    };

    componentWillUnmount() {
        this.props.actions.clear();
    }

    /**
     * Обработчик отправки формы.
     */
    handleSubmit = (e) => {
        const {email} = this.state;
        e.preventDefault();

        this.props.actions.forgot({
            email,
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
        const {email} = this.state;
        const {resetPasswordData} = this.props;
        const isPending = resetPasswordData.status === EStatusCodes.PENDING;

        if (isPending) {
            return <LoadingOverlay open />;
        }

        if (resetPasswordData.status === EStatusCodes.SUCCESS) {
            return (
                <Container component="main" maxWidth="xs">
                    <Avatar>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {i18n.t('Auth:forgot.title')}
                    </Typography>
                    <Typography component="p">
                        {i18n.t('Auth:forgot.text')}
                    </Typography>
                </Container>
            );
        }

        return (
            <React.Fragment>
                <Container component="main" maxWidth="xs">
                    <Avatar>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {i18n.t('Auth:forgot.title')}
                    </Typography>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={i18n.t('Auth:forgot.emailPlaceholder')}
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={this.createFieldChangeHandler('email')}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isPending}
                        >
                            {i18n.t('Auth:forgot.forgotButton')}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <RouteLink to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                    <Link component="span">
                                        {i18n.t('Auth:forgot.loginText')}
                                    </Link>
                                </RouteLink>
                            </Grid>
                            <Grid item>
                                <RouteLink to={ROUTER.AUTH.SIGNUP.FULL_PATH}>
                                    <Link component="span">
                                        {i18n.t('Auth:forgot.signupText')}
                                    </Link>
                                </RouteLink>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </React.Fragment>
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
 * Страница запроса отправки ссылки на страницу сброса пароля.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(ForgotPage);

export {connected as ForgotPage};
