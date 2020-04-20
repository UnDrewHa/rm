import React from 'react';
import {ROUTER} from 'src/core/router/consts';
import {ForgotPage} from 'src/modules/auth/pages/ForgotPage';
import {LoginPage} from 'src/modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'src/modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'src/modules/auth/pages/SignupPage';
import {Route, Switch} from 'react-router-dom';

export class AuthLayout extends React.Component {
    render() {
        return (
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
        );
    }
}
