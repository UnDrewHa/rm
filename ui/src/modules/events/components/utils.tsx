import {Divider} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {ROUTER} from 'core/router/consts';
import {EEventNames} from 'core/EventEmitter/enums';
import {EventEmiter} from 'core/EventEmitter/EventEmitter';
import i18n from 'i18next';
import {filter, memoize} from 'lodash-es';
import {EventMembers} from 'modules/events/components/EventMembers';
import {EventOwner} from 'modules/events/components/EventOwner';
import {IEventModel} from 'modules/events/models';
import {calculateTimeString} from 'modules/events/utils';
import {IUserModel} from 'modules/users/models';
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';

const getOwnerName = (owner: IUserModel) => {
    let ownerString = owner.email;

    if (owner.name || owner.surname) {
        ownerString = `${owner.surname} ${owner.name}`;
    }

    return ownerString;
};

const getOwnerClickHandler = memoize((owner: IUserModel) => (e) => {
    e.preventDefault();

    EventEmiter.emit(EEventNames.SHOW_MODAL, {
        title: () => i18n.t('Events:ownerModal.title'),
        renderFooter: () => null,
        renderBody: () => <EventOwner owner={owner} />,
    });
});

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
        title: () => i18n.t('Events:table.header.owner'),
        dataIndex: 'owner',
        key: 'owner',
        render: (_, record: IEventModel) => {
            const owner = record.owner as IUserModel;
            return (
                <a href="#modal" onClick={getOwnerClickHandler(owner)}>
                    {getOwnerName(owner)}
                </a>
            );
        },
        ellipsis: true,
        width: 220,
    },
];

export const columnsWithoutDescription = filter(
    baseColumnsConfig,
    (item) => item.key !== 'description',
);

export const columnsWithoutOwner = [
    ...filter(baseColumnsConfig, (item) => item.key !== 'owner'),
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
