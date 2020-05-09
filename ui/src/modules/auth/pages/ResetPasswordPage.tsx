import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {AuthActions} from 'modules/auth/actions/AuthActions';
import {IResetPasswordData} from 'modules/auth/models';
import {AuthService} from 'modules/auth/service/AuthService';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, RouteChildrenProps} from 'react-router-dom';

/**
 * Собственные свойства компонента.
 */
interface IProps extends RouteChildrenProps<{token: string}> {}

/**
 * Пропсы из stateToProps.
 *
 * @prop {IAsyncData<null>} resetPasswordData Данные сброса пароля.
 */
interface IStateProps {
    resetPasswordData: IAsyncData<null>;
}

/**
 * Пропсы из dispatchToProps.
 *
 * @prop {AuthActions} authActions Экшены.
 */
interface IDispatchProps {
    authActions: AuthActions;
}

type TProps = IProps & IStateProps & IDispatchProps;

const initialValues: IResetPasswordData = {
    password: '',
    passwordConfirm: '',
};

class ResetPasswordPage extends React.Component<TProps> {
    constructor(props) {
        super(props);

        this.props.authActions.clear();
    }

    /**
     * Отправка заполненной формы.
     *
     * @param {IResetPasswordData} values Значения элементов формы.
     */
    handleFinish = (values: IResetPasswordData) => {
        const {match} = this.props;

        this.props.authActions.reset(match.params.token, values);
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
    authActions: new AuthActions(new AuthService(), dispatch),
});

/**
 * Страница сброса пароля, путем установки нового.
 */
const connected = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage),
);

export {connected as ResetPasswordPage};
