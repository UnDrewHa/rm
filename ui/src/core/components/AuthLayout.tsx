import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';
import {ForgotPage} from 'Modules/auth/pages/ForgotPage';
import {LoginPage} from 'Modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'Modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'Modules/auth/pages/SignupPage';

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
