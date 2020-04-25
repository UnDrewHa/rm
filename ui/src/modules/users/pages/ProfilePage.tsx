import {Button, Container, TextField, Typography} from '@material-ui/core';
import i18n from 'i18next';
import {memoize} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {BuildingsAutocomplete} from 'Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'Modules/buildings/models';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';

interface IState {
    login: string;
    email: string;
    building: string;
    phone?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
    newPassword?: string;
    password: string;
    passwordConfirm: string;
}

interface IStateProps {
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    usersActions: UsersActions;
}

interface IOwnProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class ProfilePage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {
            userInfo: {data},
        } = props;

        this.state = {
            login: data.login || '',
            email: data.email || '',
            building: data.building || '',
            phone: data.phone || '',
            name: data.name || '',
            surname: data.surname || '',
            patronymic: data.patronymic || '',
            newPassword: '',
            password: '',
            passwordConfirm: '',
        };
    }

    /**
     * Обработчик отправки формы.
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            login,
            email,
            building,
            phone,
            name,
            surname,
            patronymic,
            newPassword,
            password,
            passwordConfirm,
        } = this.state;
        const {userInfo, usersActions} = this.props;

        usersActions.updateMe({
            _id: userInfo.data._id,
            login,
            email,
            building,
            phone,
            name,
            surname,
            patronymic,
            password,
            passwordConfirm,
            newPassword,
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
            building: building._id,
        });
    };

    render() {
        const {
            login,
            email,
            phone,
            name,
            surname,
            patronymic,
            newPassword,
            password,
            passwordConfirm,
        } = this.state;
        const {userInfo} = this.props;
        const isLoading = userInfo.status === EStatusCodes.PENDING;

        if (isLoading) return <LoadingOverlay open />;

        return (
            <Container component="main" maxWidth="xs">
                <Typography component="h1" variant="h5">
                    {i18n.t('Users:profile.title')}
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label={i18n.t('Users:profile.loginPlaceholder')}
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
                        id="email"
                        label={i18n.t('Users:profile.emailPlaceholder')}
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={this.createFieldChangeHandler('email')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="phone"
                        label={i18n.t('Users:profile.phonePlaceholder')}
                        name="phone"
                        autoComplete="phone"
                        value={phone}
                        onChange={this.createFieldChangeHandler('phone')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="name"
                        label={i18n.t('Users:profile.namePlaceholder')}
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={this.createFieldChangeHandler('name')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="surname"
                        label={i18n.t('Users:profile.surnamePlaceholder')}
                        name="surname"
                        autoComplete="surname"
                        value={surname}
                        onChange={this.createFieldChangeHandler('surname')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="patronymic"
                        label={i18n.t('Users:profile.patronymicPlaceholder')}
                        name="patronymic"
                        autoComplete="patronymic"
                        value={patronymic}
                        onChange={this.createFieldChangeHandler('patronymic')}
                    />
                    <BuildingsAutocomplete
                        onSelect={this.handleBuildingSelect}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="newPassword"
                        label={i18n.t('Users:profile.newPasswordPlaceholder')}
                        type="password"
                        id="newPassword"
                        autoComplete="current-newPassword"
                        value={newPassword}
                        onChange={this.createFieldChangeHandler('newPassword')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={i18n.t('Users:profile.passwordPlaceholder')}
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
                        label={i18n.t(
                            'Users:profile.passwordConfirmPlaceholder',
                        )}
                        type="password"
                        id="passwordConfirm"
                        autoComplete="passwordConfirm"
                        value={passwordConfirm}
                        onChange={this.createFieldChangeHandler(
                            'passwordConfirm',
                        )}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {i18n.t('actions.save')}
                    </Button>
                </form>
            </Container>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    userInfo: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    usersActions: new UsersActions(new UsersService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(ProfilePage),
);

export {connected as ProfilePage};
