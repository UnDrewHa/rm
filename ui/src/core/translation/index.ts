import i18n from 'i18next';
import BuildingsTranslations from 'src/modules/buildings/translations/ru/BuildingsTranslations';
import EventsTranslations from 'src/modules/events/translations/ru/EventsTranslations';
import RoomsTranslations from 'src/modules/rooms/translations/ru/RoomsTranslations';
import CommonTranslations from './CommonTranslations';
import AuthTranslations from 'src/modules/auth/translations/ru/AuthTranslations';

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
