import i18n from 'i18next';
import CounterTranslations from '../../modules/counter/CounterTranslations';
import CommonTranslations from './CommonTranslations';
import AuthTranslations from 'src/modules/auth/translations/ru/AuthTranslations';

export function i18nInit(): Promise<Function> {
    return i18n.init({
        lng: 'ru',
        debug: true,
        resources: {
            ru: {
                ...CommonTranslations,
                ...CounterTranslations,
                ...AuthTranslations,
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
