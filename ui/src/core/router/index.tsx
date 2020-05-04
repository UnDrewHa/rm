import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {AuthLayout} from 'core/components/AuthLayout';
import {MainLayout} from 'core/components/MainLayout';
import {RedirectListener} from 'core/components/RedirectListener';
import {ROUTER} from 'core/router/consts';

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
