import React from 'react';
import {ForgotPage} from 'src/modules/auth/pages/ForgotPage';
import {LoginPage} from 'src/modules/auth/pages/LoginPage';
import {ResetPasswordPage} from 'src/modules/auth/pages/ResetPasswordPage';
import {SignupPage} from 'src/modules/auth/pages/SignupPage';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import i18n from 'i18next';

function Home() {
    return <div>дом</div>;
}

function Links() {
    return (
        <ul>
            <li>
                <Link to="/">{i18n.t('links.home')}</Link>
            </li>
            <li>
                <Link to="/login">{i18n.t('links.login')}</Link>
            </li>
        </ul>
    );
}

export function RouterData() {
    return (
        <Router>
            <Links />
            <Switch>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/signup">
                    <SignupPage />
                </Route>
                <Route path="/forgot">
                    <ForgotPage />
                </Route>
                <Route path="/reset/:token">
                    <ResetPasswordPage />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}
