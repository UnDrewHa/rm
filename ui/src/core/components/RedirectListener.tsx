import React from 'react';
import {useHistory} from 'react-router';
import {EEventNames} from 'src/core/EventEmitter/enums';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';

export const RedirectListener = () => {
    const history = useHistory();
    const handleRedirect = (to: string) => history.push(to);

    EventEmiter.subscribe(EEventNames.REDIRECT, handleRedirect);

    return <div />;
};
