import moment from 'moment';
import {IEventModel} from 'Modules/events/models';

export const calculateTimeString = (event: IEventModel) => {
    const from = moment(event.from).format('HH:mm');
    const to = moment(event.to).format('HH:mm');

    return `${from} - ${to}`;
};
