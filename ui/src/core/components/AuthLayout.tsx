import {Col, Layout, Row} from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ROUTER} from 'core/router/consts';
import {ForgotPage} from 'modules/auth/pages/ForgotPage';
import {LoginPage} from 'modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'modules/auth/pages/SignupPage';

const {Content} = Layout;

export class AuthLayout extends React.Component {
    render() {
        return (
            <Layout className="auth-layout">
                <Content>
                    <Row>
                        <Col span={6} offset={9} className="auth-page">
                            <Switch>
                                <Route path={ROUTER.AUTH.LOGIN.FULL_PATH}>
                                    <LoginPage />
                                </Route>
                                <Route path={ROUTER.AUTH.SIGNUP.FULL_PATH}>
                                    <SignupPage />
                                </Route>
                                <Route path={ROUTER.AUTH.FORGOT.FULL_PATH}>
                                    <ForgotPage />
                                </Route>
                                <Route path={ROUTER.AUTH.RESET.FULL_PATH}>
                                    <ResetPasswordPage />
                                </Route>
                            </Switch>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
