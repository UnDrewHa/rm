import moment, {Moment} from 'moment';
import {IEventModel} from 'modules/events/models';

export const calculateTimeString = (event: IEventModel) => {
    const from = moment(event.from).format('HH:mm');
    const to = moment(event.to).format('HH:mm');

    return `${from} - ${to}`;
};

export const disabledDate = (current: Moment) =>
    current && current < moment().subtract(1, 'day');
