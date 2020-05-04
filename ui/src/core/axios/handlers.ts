import {message} from 'antd';
import i18n from 'i18next';
import {InterfaceAction} from 'src/Core/actions/InterfaceActions';
import {ROUTER} from 'src/Core/router/consts';

export const handleUnauthorized = (error) => {
    const {data} = error.response;
    const text = data?.error?.message || i18n.t('error.401');

    message.error({
        content: text,
        key: 401,
    });
    InterfaceAction.redirect(ROUTER.AUTH.LOGIN.FULL_PATH);

    return;
};

export const handleNetworkError = (data) => {
    return message.error(data.message);
};
