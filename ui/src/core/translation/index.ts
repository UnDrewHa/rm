import i18n from 'i18next';
import AdminTranslations from 'src/Modules/admin/translations/ru/AdminTranslations';
import AuthTranslations from 'src/Modules/auth/translations/ru/AuthTranslations';
import BuildingsTranslations from 'src/Modules/buildings/translations/ru/BuildingsTranslations';
import EventsTranslations from 'src/Modules/events/translations/ru/EventsTranslations';
import RoomsTranslations from 'src/Modules/rooms/translations/ru/RoomsTranslations';
import UsersTranslations from 'src/Modules/users/translations/ru/UsersTranslations';
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
