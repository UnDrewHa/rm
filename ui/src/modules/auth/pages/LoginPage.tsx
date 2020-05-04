import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {defaultValidateMessages, validationConsts} from 'Core/validationConsts';
import {AuthActions} from 'Modules/auth/actions/AuthActions';
import {AuthService} from 'Modules/auth/service/AuthService';
import 'Modules/auth/styles/auth.scss';
import {IUserModel} from 'Modules/users/models';

const {Title} = Typography;

interface IStateProps {
    userData: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

const initialValues = {
    login: '',
    password: '',
};

class LoginPage extends React.Component<TProps> {
    constructor(props: TProps) {
        super(props);

        props.actions.clear();
    }
    handleFinish = (values) => {
        this.props.actions.login(values);
    };

    render() {
        const {userData} = this.props;
        const isPending = userData.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <Avatar size="large" icon={<UserOutlined />} />
                <Title level={3}>{i18n.t('Auth:login.title')}</Title>
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
    userData: state.users.profile,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница входа.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export {connected as LoginPage};
