import {IRedirectOptions} from 'core/components/RedirectListener';
import {EEventNames} from 'core/EventEmitter/enums';
import {EventEmiter} from 'core/EventEmitter/EventEmitter';

const InterfaceAction = {
    /**
     * Редирект на определенный URL.
     *
     * @param {string | IRedirectOptions} data Данные для редиректа.
     */
    redirect(data: string | IRedirectOptions) {
        EventEmiter.emit(EEventNames.REDIRECT, data);
    },
};

export {InterfaceAction};
