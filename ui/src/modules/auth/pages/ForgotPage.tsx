import {UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Col, Form, Input, Row, Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link as RouteLink} from 'react-router-dom';
import {EStatusCodes} from 'src/Core/reducer/enums';
import {IAsyncData} from 'src/Core/reducer/model';
import {ROUTER} from 'src/Core/router/consts';
import {TAppStore} from 'src/Core/store/model';
import {
    defaultValidateMessages,
    validationConsts,
} from 'src/Core/validationConsts';
import {AuthActions} from 'src/Modules/auth/actions/AuthActions';
import {AuthService} from 'src/Modules/auth/service/AuthService';

interface IStateProps {
    resetPasswordData: IAsyncData<null>;
}

interface IDispatchProps {
    actions: AuthActions;
}

type TProps = IStateProps & IDispatchProps;

const initialValues = {
    email: '',
};

/**
 * Страница запроса отправки ссылки на страницу сброса пароля.
 */
class ForgotPage extends React.Component<TProps> {
    componentWillUnmount() {
        this.props.actions.clear();
    }

    /**
     * Обработчик отправки формы.
     */
    handleFinish = (values) => {
        this.props.actions.forgot(values);
    };

    render() {
        const {resetPasswordData} = this.props;
        const isPending = resetPasswordData.status === EStatusCodes.PENDING;

        if (resetPasswordData.status === EStatusCodes.SUCCESS) {
            return (
                <React.Fragment>
                    <Avatar size="large" icon={<UserOutlined />} />
                    <Typography.Title level={3}>
                        {i18n.t('Auth:forgot.title')}
                    </Typography.Title>
                    <Typography.Text>
                        {i18n.t('Auth:forgot.text')}
                    </Typography.Text>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Avatar size="large" icon={<UserOutlined />} />
                <Typography.Title level={3}>
                    {i18n.t('Auth:forgot.title')}
                </Typography.Title>
                <Form
                    validateMessages={defaultValidateMessages}
                    className="auth-form"
                    initialValues={initialValues}
                    onFinish={this.handleFinish}
                >
                    <Form.Item
                        name="email"
                        rules={validationConsts.user.email as any}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder={i18n.t('Auth:forgot.emailPlaceholder')}
                            type="email"
                        />
                    </Form.Item>
                    <Form.Item className="links-block">
                        <Row>
                            <Col span={12}>
                                <RouteLink to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                    {i18n.t('Auth:forgot.loginText')}
                                </RouteLink>
                            </Col>
                            <Col span={12} className="ta-right">
                                <RouteLink to={ROUTER.AUTH.SIGNUP.FULL_PATH}>
                                    {i18n.t('Auth:forgot.signupText')}
                                </RouteLink>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                        >
                            {i18n.t('Auth:forgot.forgotButton')}
                        </Button>
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
 * Страница запроса отправки ссылки на страницу сброса пароля.
 */
const connected = connect(mapStateToProps, mapDispatchToProps)(ForgotPage);

export {connected as ForgotPage};
