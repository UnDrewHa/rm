import {withSnackbar, ProviderContext} from 'notistack';
import React from 'react';
import {EEventNames} from 'Core/EventEmitter/enums';
import {EventEmiter} from 'Core/EventEmitter/EventEmitter';

type TProps = ProviderContext;

const defaultProps = {
    variant: 'default',
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    preventDuplicate: true,
};

class Notifier extends React.Component<TProps> {
    constructor(props) {
        super(props);

        EventEmiter.subscribe(
            EEventNames.SHOW_NOTIFICATION,
            this.handleShowNotification,
        );
    }

    /**
     * Обработать показ уведомления.
     *
     * @param {any} data Данные для уведомления.
     */
    handleShowNotification = ({message = '', options = {}}: any = {}) => {
        this.props.enqueueSnackbar(message, {
            ...defaultProps,
            ...options,
        });
    };

    render() {
        return null;
    }
}

const NotifierSnackbar = withSnackbar(Notifier);

export {NotifierSnackbar as Notifier};
