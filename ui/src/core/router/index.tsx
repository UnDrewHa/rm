import React from 'react';
import {RedirectListener} from 'src/core/components/RedirectListener';
import {ROUTER} from 'src/core/router/consts';
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
                <Link to={ROUTER.MAIN}>{i18n.t('links.home')}</Link>
            </li>
            <li>
                <Link to={ROUTER.LOGIN}>{i18n.t('links.login')}</Link>
            </li>
        </ul>
    );
}

export function RouterData() {
    return (
        <Router>
            <RedirectListener />
            <Links />
            <Switch>
                <Route path={ROUTER.LOGIN}>
                    <LoginPage />
                </Route>
                <Route path={ROUTER.SIGNUP}>
                    <SignupPage />
                </Route>
                <Route path={ROUTER.FORGOT}>
                    <ForgotPage />
                </Route>
                <Route path={ROUTER.RESET}>
                    <ResetPasswordPage />
                </Route>
                <Route path={ROUTER.MAIN}>
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}
