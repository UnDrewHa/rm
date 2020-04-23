import i18n from 'i18next';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {ROUTER} from 'Core/router/consts';

export const handleUnauthorized = (error) => {
    const {data} = error.response;
    const message = data?.error?.message || i18n.t('error.401');

    InterfaceAction.notify(message, 'error');
    InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);

    return;
};

export const handleNetworkError = ({message}) => {
    return InterfaceAction.notify(message, 'error');
};
