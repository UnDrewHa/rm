import i18n from 'i18next';
import AdminTranslations from 'modules/admin/translations/ru/AdminTranslations';
import AuthTranslations from 'modules/auth/translations/ru/AuthTranslations';
import BuildingsTranslations from 'modules/buildings/translations/ru/BuildingsTranslations';
import EventsTranslations from 'modules/events/translations/ru/EventsTranslations';
import RoomsTranslations from 'modules/rooms/translations/ru/RoomsTranslations';
import UsersTranslations from 'modules/users/translations/ru/UsersTranslations';
import CommonTranslations from './CommonTranslations';

export function i18nInit(): Promise<Function> {
    return i18n.init({
        lng: 'ru',
        debug: process.env.NODE_ENV !== 'production',
        resources: {
            ru: {
                ...CommonTranslations,
                ...AuthTranslations,
                ...BuildingsTranslations,
                ...RoomsTranslations,
                ...EventsTranslations,
                ...UsersTranslations,
                ...AdminTranslations,
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
