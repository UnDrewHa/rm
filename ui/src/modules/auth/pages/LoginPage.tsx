import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {AuthActions} from 'modules/auth/actions/AuthActions';
import {ILoginData} from 'modules/auth/models';
import {AuthService} from 'modules/auth/service/AuthService';
import {IUserModel} from 'modules/users/models';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';

/**
 * Пропсы из stateToProps.
 *
 * @prop {IAsyncData<IUserModel>} profile Данные профиля.
 */
interface IStateProps {
    profile: IAsyncData<IUserModel>;
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

const initialValues: ILoginData = {
    login: '',
    password: '',
};

class LoginPage extends React.Component<TProps> {
    constructor(props: TProps) {
        super(props);

        props.authActions.clear();
    }

    /**
     * Отправка заполненной формы.
     *
     * @param {ILoginData} values Значения элементов формы.
     */
    handleFinish = (values: ILoginData) => {
        this.props.authActions.login(values);
    };

    render() {
        const {profile} = this.props;
        const isPending = profile.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <Avatar size="large" icon={<UserOutlined />} />
                <Typography.Title level={3}>
                    {i18n.t('Auth:login.title')}
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
                            placeholder={i18n.t('Auth:login.loginPlaceholder')}
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
                                'Auth:login.passwordPlaceholder',
                            )}
                        />
                    </Form.Item>
                    <Form.Item className="links-block">
                        <Row>
                            <Col span={12}>
                                <RouteLink to={ROUTER.AUTH.SIGNUP.FULL_PATH}>
                                    {i18n.t('Auth:login.signup')}
                                </RouteLink>
                            </Col>
                            <Col span={12} className="ta-right">
                                <RouteLink to={ROUTER.AUTH.FORGOT.FULL_PATH}>
                                    {i18n.t('Auth:login.forgot')}
                                </RouteLink>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={isPending}
                        >
                            {i18n.t('Auth:login.loginButton')}
                        </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    profile: state.users.profile,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    authActions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница входа.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export {connected as LoginPage};
