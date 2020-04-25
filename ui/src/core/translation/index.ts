import i18n from 'i18next';
import AuthTranslations from 'Modules/auth/translations/ru/AuthTranslations';
import BuildingsTranslations from 'Modules/buildings/translations/ru/BuildingsTranslations';
import EventsTranslations from 'Modules/events/translations/ru/EventsTranslations';
import RoomsTranslations from 'Modules/rooms/translations/ru/RoomsTranslations';
import UsersTranslations from 'Modules/users/translations/ru/UsersTranslations';
import CommonTranslations from './CommonTranslations';

export function i18nInit(): Promise<Function> {
    return i18n.init({
        lng: 'ru',
        debug: true,
        resources: {
            ru: {
                ...CommonTranslations,
                ...AuthTranslations,
                ...BuildingsTranslations,
                ...RoomsTranslations,
                ...EventsTranslations,
                ...UsersTranslations,
            },
        },
        defaultNS: 'Common',
        nsSeparator: ':',
        keySeparator: '.',
        contextSeparator: '#',
        pluralSeparator: '-',
        interpolation: {escapeValue: false},
    });
}
