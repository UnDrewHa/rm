import {OptionsObject, VariantType} from 'notistack';
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

    /**
     * Показать уведомление.
     *
     * @param {string} message Сообщение.
     * @param {VariantType} variant Вариант отображения.
     * @param {OptionsObject} [options] Настройки.
     */
    notify(message: string, variant: VariantType, options: OptionsObject = {}) {
        EventEmiter.emit(EEventNames.SHOW_NOTIFICATION, {
            message,
            options: {
                variant,
                ...options,
            },
        });
    },
};

export {InterfaceAction};
