import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {defaultValidateMessages, validationConsts} from 'Core/validationConsts';
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

const initialValues = {
    password: '',
    passwordConfirm: '',
};

class ResetPasswordPage extends React.Component<TProps> {
    constructor(props) {
        super(props);

        this.props.actions.clear();
    }

    /**
     * Обработчик отправки формы.
     */
    handleFinish = (values) => {
        const {match} = this.props;

        this.props.actions.reset(match.params.token, values);
    };

    render() {
        const {resetPasswordData} = this.props;
        const isPending = resetPasswordData.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <Avatar size="large" icon={<UserOutlined />} />
                <Typography.Title level={3}>
                    {i18n.t('Auth:reset.title')}
                </Typography.Title>
                <Form
                    validateMessages={defaultValidateMessages}
                    className="auth-form"
                    initialValues={initialValues}
                    onFinish={this.handleFinish}
                >
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
                                'Auth:reset.passwordPlaceholder',
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
                                'Auth:reset.passwordConfirmPlaceholder',
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
                                    {i18n.t('Auth:reset.saveButton')}
                                </Button>
                            </Col>
                            <Col span={12} className="ta-right">
                                <Link to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                    {i18n.t('Auth:signup.loginText')}
                                </Link>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
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
 * Страница сброса пароля, путем установки нового.
 */
const connected = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage),
);

export {connected as ResetPasswordPage};
