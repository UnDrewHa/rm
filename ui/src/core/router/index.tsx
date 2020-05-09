import {MainLayout} from 'core/components/MainLayout';
import {RedirectListener} from 'core/components/RedirectListener';
import {ROUTER} from 'core/router/consts';
import {AuthLayout} from 'modules/auth/pages/AuthLayout';
import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

export function RouterData() {
    return (
        <Router>
            <RedirectListener />
            <Switch>
                <Route path={ROUTER.AUTH.FULL_PATH}>
                    <AuthLayout />
                </Route>
                <Route path={ROUTER.MAIN.FULL_PATH}>
                    <MainLayout />
                </Route>
            </Switch>
        </Router>
    );
}
