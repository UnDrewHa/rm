import {IEventModel} from 'src/modules/events/models';
import moment from 'moment';

export const calculateTimeString = (event: IEventModel) => {
    const from = moment(event.from).format('HH:mm');
    const to = moment(event.to).format('HH:mm');

    return `${from} - ${to}`;
};
