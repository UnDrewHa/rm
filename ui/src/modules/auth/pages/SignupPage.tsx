import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import {AuthActions} from 'modules/auth/actions/AuthActions';
import {AuthService} from 'modules/auth/service/AuthService';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {IUserModel} from 'modules/users/models';

interface IStateProps {
    userData: IAsyncData<IUserModel>;
    buildingsData: IAsyncData<IBuildingModel[]>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    building: string;
}

const initialValues = {
    login: '',
    password: '',
    passwordConfirm: '',
    email: '',
};

class SignupPage extends React.Component<TProps, IState> {
    state: IState = {
        building: '',
    };

    /**
     * Обработчик отправки формы.
     */
    handleFinish = (values) => {
        this.props.actions.signUp({
            ...values,
            building: this.state.building,
        });
    };

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option._id,
        });
    };

    render() {
        const {userData} = this.props;
        const isPending = userData.status === EStatusCodes.PENDING;

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
    userData: state.users.profile,
    buildingsData: state.buildings.list,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(SignupPage);

export {connected as SignupPage};
