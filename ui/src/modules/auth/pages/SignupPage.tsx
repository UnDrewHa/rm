import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {AuthActions} from 'modules/auth/actions/AuthActions';
import {ISignupData} from 'modules/auth/models';
import {AuthService} from 'modules/auth/service/AuthService';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {IUserModel} from 'modules/users/models';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';

/**
 * Пропсы из stateToProps.
 *
 * @prop {IAsyncData<IUserModel>} profile Данные профиля.
 * @prop {IAsyncData<IBuildingModel[]>} buildingsData Данные списка зданий.
 */
interface IStateProps {
    profile: IAsyncData<IUserModel>;
    buildingsData: IAsyncData<IBuildingModel[]>;
}

/**
 * Пропсы из dispatchToProps.
 *
 * @prop {AuthActions} authActions Экшены.
 */
interface IDispatchProps {
    authActions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

/**
 * Состояние компонента.
 *
 * @prop {string} buildingId Идентификатор здания.
 */
interface IState {
    buildingId: string;
}

const initialValues: ISignupData = {
    login: '',
    password: '',
    passwordConfirm: '',
    email: '',
    building: '',
};

class SignupPage extends React.Component<TProps, IState> {
    state: IState = {
        buildingId: '',
    };

    /**
     * Отправка заполненной формы.
     *
     * @param {ISignupData} values Значения элементов формы.
     */
    handleFinish = (values: ISignupData) => {
        this.props.authActions.signUp({
            ...values,
            building: this.state.buildingId,
        });
    };

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            buildingId: option._id,
        });
    };

    render() {
        const {profile} = this.props;
        const isPending = profile.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <Avatar size="large" icon={<UserOutlined />} />
                <Typography.Title level={3}>
                    {i18n.t('Auth:signup.title')}
                </Typography.Title>
                <Form
                    validateMessages={defaultValidateMessages}
                    className="auth-form"
                    initialValues={initialValues}
                    onFinish={this.handleFinish}
                >
                    <Form.Item name="login" rules={validationConsts.user.login}>
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder={i18n.t('Auth:signup.loginPlaceholder')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={validationConsts.user.email as any}
                    >
                        <Input
                            type="email"
                            prefix={
                                <MailOutlined className="site-form-item-icon" />
                            }
                            placeholder={i18n.t('Auth:signup.emailPlaceholder')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="building"
                        rules={validationConsts.common.required}
                    >
                        <BuildingsAutocomplete
                            onSelect={this.handleBuildingSelect}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={validationConsts.user.password}
                    >
                        <Input
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder={i18n.t(
                                'Auth:signup.passwordPlaceholder',
                            )}
                        />
                    </Form.Item>
                    <Form.Item
                        name="passwordConfirm"
                        rules={validationConsts.user.passwordConfirm}
                    >
                        <Input
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder={i18n.t(
                                'Auth:signup.passwordConfirmPlaceholder',
                            )}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={isPending}
                                >
                                    {i18n.t('Auth:signup.signupButton')}
                                </Button>
                            </Col>
                            <Col span={12} className="ta-right">
                                <RouteLink to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                    {i18n.t('Auth:signup.loginText')}
                                </RouteLink>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    profile: state.users.profile,
    buildingsData: state.buildings.list,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    authActions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(SignupPage);

export {connected as SignupPage};
