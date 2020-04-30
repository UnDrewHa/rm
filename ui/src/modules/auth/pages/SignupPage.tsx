import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';
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
                    className="auth-form"
                    initialValues={initialValues}
                    onFinish={this.handleFinish}
                >
                    <Form.Item
                        name="login"
                        rules={[
                            {
                                required: true,
                                message: i18n.t('forms.requiredText'),
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder={i18n.t('Auth:signup.loginPlaceholder')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: i18n.t('forms.requiredText'),
                            },
                        ]}
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
                        rules={[
                            {
                                required: true,
                                message: i18n.t('forms.requiredText'),
                            },
                        ]}
                    >
                        <BuildingsAutocomplete
                            onSelect={this.handleBuildingSelect}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: i18n.t('forms.requiredText'),
                            },
                        ]}
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
                        rules={[
                            {
                                required: true,
                                message: i18n.t('forms.requiredText'),
                            },
                        ]}
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
