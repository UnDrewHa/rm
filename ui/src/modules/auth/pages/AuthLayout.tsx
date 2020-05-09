import {Col, Layout, Row} from 'antd';
import {getErrorPage} from 'core/pages/404';
import {ROUTER} from 'core/router/consts';
import {ForgotPage} from 'modules/auth/pages/ForgotPage';
import {LoginPage} from 'modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'modules/auth/pages/SignupPage';
import 'modules/auth/styles/auth.scss';
import React from 'react';
import {Route, Switch} from 'react-router-dom';

const {LOGIN, SIGNUP, FORGOT, RESET} = ROUTER.AUTH;

/**
 * Лэйаут всей части приложения, отвечающей за авторизацию и восстановление доступа в систему.
 */
export class AuthLayout extends React.Component {
    render() {
        return (
            <Layout className="auth-layout">
                <Layout.Content>
                    <Row justify="center">
                        <Col
                            xs={24}
                            sm={16}
                            md={12}
                            lg={10}
                            xl={8}
                            className="auth-page"
                        >
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
