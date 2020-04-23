import moment, {Moment} from 'moment';

/**
 * Обновить в объекте time только день, месяц и год, оставив время.
 *
 * @param {Moment} time Объект, который меняем.
 * @param {Moment} date Объект, у которого берем значения.
 */
export const changeOnlyDate = (time: Moment, date: Moment) => {
    let newTime = moment(time);

    newTime.set('year', date.get('year'));
    newTime.set('month', date.get('month'));
    newTime.set('date', date.get('date'));

    return newTime;
};
