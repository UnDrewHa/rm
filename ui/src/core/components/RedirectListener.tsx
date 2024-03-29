import {EEventNames} from 'core/EventEmitter/enums';
import {EventEmiter} from 'core/EventEmitter/EventEmitter';
import {isEmpty} from 'lodash-es';
import queryString from 'query-string';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';

export interface IRedirectOptions {
    to: string;
    params?: {
        [param: string]: any;
    };
    search?: {
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
            let pathname = options.to;
            if (!isEmpty(params)) {
                Object.keys(params).forEach((key) => {
                    pathname = pathname.replace(':' + key, params[key]);
                });
            }

            history.push({
                pathname,
                search: queryString.stringify(options.search || {}),
            });
        }
    };

    useEffect(() => {
        return EventEmiter.subscribe(EEventNames.REDIRECT, handleRedirect);
    });

    return <div />;
};
