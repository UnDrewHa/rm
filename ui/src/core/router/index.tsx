import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {AuthLayout} from 'src/Core/components/AuthLayout';
import {MainLayout} from 'src/Core/components/MainLayout';
import {RedirectListener} from 'src/Core/components/RedirectListener';
import {ROUTER} from 'src/Core/router/consts';

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
