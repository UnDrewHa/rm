import {IRedirectOptions} from 'src/Core/components/RedirectListener';
import {EEventNames} from 'src/Core/EventEmitter/enums';
import {EventEmiter} from 'src/Core/EventEmitter/EventEmitter';

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
