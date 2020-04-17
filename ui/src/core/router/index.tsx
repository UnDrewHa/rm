import React from 'react';
import {connect} from 'react-redux';
import {LoginPage} from 'src/modules/auth/pages/LoginPage';
import {CounterActions} from '../../modules/counter/actions/Actions';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import i18n from 'i18next';

function AllContacts() {
    return <div>AllContacts</div>;
}

function Home(props: any) {
    const handleIncrement = () => {
        props.actions.increment();
    };

    const handleDecrement = () => {
        props.actions.decrement();
    };

    return (
        <div>
            {i18n.t('Counter:title', {number: props.counter})}
            <br />
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
        </div>
    );
}

const Connected = connect(
    (state: any) => ({counter: state.counter}),
    (dispatch) => ({actions: new CounterActions(dispatch)}),
)(Home);

function Links() {
    return (
        <ul>
            <li>
                <Link to="/">{i18n.t('links.home')}</Link>
            </li>
            <li>
                <Link to="/login">{i18n.t('links.login')}</Link>
            </li>
            <li>
                <Link to="/contact">{i18n.t('links.contacts')}</Link>
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
                <Route path="/contact">
                    <AllContacts />
                </Route>
                <Route path="/">
                    <Connected />
                </Route>
            </Switch>
        </Router>
    );
}
