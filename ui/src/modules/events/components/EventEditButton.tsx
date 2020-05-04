import {EditOutlined} from '@ant-design/icons';
import i18n from 'i18next';
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';
import {IEventModel} from 'Modules/events/models';

interface IOwnProps {
    event: IEventModel;
    layout?: 'text' | 'icon';
}

export const EventEditButton = (props: IOwnProps) => {
    const {event, layout} = props;

    return (
        <Link
            to={{
                pathname: ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
                state: {
                    id: event._id,
                    title: event.title,
                    date: moment(event.date),
                    from: moment(event.from),
                    to: moment(event.to),
                    description: event.description,
                    members: event.members,
                },
                search: `?room=${event.room}`,
            }}
        >
            {layout === 'icon' ? (
                <EditOutlined title={i18n.t('actions.edit')} />
            ) : (
                i18n.t('actions.edit')
            )}
        </Link>
    );
};
