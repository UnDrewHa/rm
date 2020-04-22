import {isEmpty} from 'lodash-es';
import React from 'react';
import {useHistory} from 'react-router';
import {EEventNames} from 'src/core/EventEmitter/enums';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';

interface IRedirectOptions {
    to: string;
    params: {
        [param: string]: any;
    };
}

export const RedirectListener = () => {
    const history = useHistory();
    const handleRedirect = (options: string | IRedirectOptions) => {
        if (typeof options === 'string') {
            history.push(options);
        } else {
            const {params} = options;
            let to = options.to;
            if (!isEmpty(params)) {
                Object.keys(params).forEach((key) => {
                    to = to.replace(':' + key, params[key]);
                });
            }

            history.push(to);
        }
    };

    EventEmiter.subscribe(EEventNames.REDIRECT, handleRedirect);

    return <div />;
};
