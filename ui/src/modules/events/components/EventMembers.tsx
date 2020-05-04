import {Tag, Typography} from 'antd';
import React from 'react';
import {IEventModel} from 'Modules/events/models';

interface IOwnProps {
    event: IEventModel;
}

export const EventMembers = ({event}: IOwnProps) => {
    return (
        <Typography.Paragraph className="event-members">
            {event.members.map((item) => (
                <Tag key={item}>{item}</Tag>
            ))}
        </Typography.Paragraph>
    );
};
