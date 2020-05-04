import {Col, Layout, Row} from 'antd';
import 'antd/dist/antd.css';
import {getErrorPage} from 'core/pages/404';
import {ROUTER} from 'core/router/consts';
import {ForgotPage} from 'modules/auth/pages/ForgotPage';
import {LoginPage} from 'modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'modules/auth/pages/SignupPage';
import React from 'react';
import {Route, Switch} from 'react-router-dom';

const {LOGIN, SIGNUP, FORGOT, RESET} = ROUTER.AUTH;

export class AuthLayout extends React.Component {
    render() {
        return (
            <Layout className="auth-layout">
                <Layout.Content>
                    <Row>
                        <Col span={6} offset={9} className="auth-page">
                            <Switch>
                                <Route path={LOGIN.FULL_PATH}>
                                    <LoginPage />
                                </Route>
                                <Route path={SIGNUP.FULL_PATH}>
                                    <SignupPage />
                                </Route>
                                <Route path={FORGOT.FULL_PATH}>
                                    <ForgotPage />
                                </Route>
                                <Route path={RESET.FULL_PATH}>
                                    <ResetPasswordPage />
                                </Route>
                                <Route
                                    component={getErrorPage(
                                        ROUTER.MAIN.FULL_PATH,
                                        404,
                                    )}
                                />
                            </Switch>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        );
    }
}
