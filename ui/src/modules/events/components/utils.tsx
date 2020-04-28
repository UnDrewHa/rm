import {Divider} from 'antd';
import i18n from 'i18next';
import {filter, memoize} from 'lodash-es';
import React from 'react';
import {Link} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';
import {EEventNames} from 'Core/EventEmitter/enums';
import {EventEmiter} from 'Core/EventEmitter/EventEmitter';
import {EventDeleteButton} from 'Modules/events/components/EventDeleteButton';
import {EventEditButton} from 'Modules/events/components/EventEditButton';
import {EventMembers} from 'Modules/events/components/EventMembers';
import {EventOwner} from 'Modules/events/components/EventOwner';
import {IEventModel} from 'Modules/events/models';
import {calculateTimeString} from 'Modules/events/utils';
import {IUserModel} from 'Modules/users/models';

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

export const columnsWithActions = [
    ...columnsWithoutOwner,
    {
        title: () => i18n.t('Events:table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record: IEventModel) => (
            <React.Fragment>
                <EventEditButton event={record} />
                <Divider type="vertical" />
                <EventDeleteButton ids={[record._id]} />
            </React.Fragment>
        ),
    },
];
