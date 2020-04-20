import React from 'react';
import {AuthLayout} from 'src/core/components/AuthLayout';
import {MainLayout} from 'src/core/components/MainLayout';
import {RedirectListener} from 'src/core/components/RedirectListener';
import {ROUTER} from 'src/core/router/consts';
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
