import {Divider} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {filter, memoize} from 'lodash-es';
import {EventMembers} from 'modules/events/components/EventMembers';
import {EventStatus} from 'modules/events/components/EventStatus';
import {IEventModel} from 'modules/events/models';
import {calculateTimeString} from 'modules/events/utils';
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';

export const baseColumnsConfig = [
    {
        title: () => i18n.t('Events:table.header.title'),
        dataIndex: 'title',
        key: 'title',
        render: (_, record: IEventModel) => (
            <Link to={ROUTER.MAIN.EVENTS.DETAILS.PATH + record._id}>
                {record.title}
            </Link>
        ),
        ellipsis: true,
    },
    {
        title: () => i18n.t('Events:table.header.description'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: () => i18n.t('Events:table.header.date'),
        dataIndex: 'date',
        key: 'date',
        width: 120,
    },
    {
        title: () => i18n.t('Events:table.header.time'),
        dataIndex: 'from',
        key: 'from',
        render: (_, record: IEventModel) => calculateTimeString(record),
        width: 120,
    },
    {
        title: () => i18n.t('Events:table.header.approveStatus'),
        dataIndex: 'approveStatus',
        key: 'approveStatus',
        render: (_, record: IEventModel) => (
            <EventStatus status={record.approveStatus} />
        ),
        width: 150,
    },
];

export const columnsWithoutDescription = filter(
    baseColumnsConfig,
    (item) => item.key !== 'description',
);

export const columnsWithoutOwner = [
    ...baseColumnsConfig,
    {
        title: () => i18n.t('Events:table.header.members'),
        dataIndex: 'members',
        key: 'members',
        render: (_, record: IEventModel) => <EventMembers event={record} />,
    },
];

export const getColumnsWithActions = memoize((actions) => [
    ...columnsWithoutOwner,
    {
        title: () => i18n.t('Events:table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record: IEventModel) => (
            <React.Fragment>
                <EditButton
                    to={{
                        pathname: ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
                        state: {
                            id: record._id,
                            title: record.title,
                            date: moment(record.date),
                            from: moment(record.from),
                            to: moment(record.to),
                            description: record.description,
                            members: record.members,
                        },
                        search: `?room=${record.room}`,
                    }}
                />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
            </React.Fragment>
        ),
    },
]);
