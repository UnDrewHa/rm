import {IRedirectOptions} from 'Core/components/RedirectListener';
import {EEventNames} from 'Core/EventEmitter/enums';
import {EventEmiter} from 'Core/EventEmitter/EventEmitter';

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
