import {EEventNames} from 'src/core/EventEmitter/enums';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';
import i18n from 'i18next';
import {ROUTER} from 'src/core/router/consts';

export const handleUnauthorized = (error) => {
    const {data} = error.response;
    const message = data?.error?.message || i18n.t('error.401');

    EventEmiter.emit(EEventNames.SHOW_NOTIFICATION, {
        message,
        options: {
            variant: 'error',
        },
    });

    EventEmiter.emit(EEventNames.REDIRECT, ROUTER.AUTH.LOGIN.FULL_PATH);

    return;
};
