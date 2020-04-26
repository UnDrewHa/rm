import {Typography} from 'antd';
import i18n from 'i18next';
import {memoize} from 'lodash-es';
import React from 'react';
import {Link} from 'react-router-dom';
import {ITableConfig} from 'Core/components/models';
import {ROUTER} from 'Core/router/consts';
import {EEventNames} from 'Core/EventEmitter/enums';
import {EventEmiter} from 'Core/EventEmitter/EventEmitter';
import {IEventModel} from 'Modules/events/models';
import {calculateTimeString} from 'Modules/events/utils';
import {IUserModel} from 'Modules/users/models';

export const basicTableConfig: ITableConfig = {
    keys: ['id', 'time', 'name'],
    getItems: function (items: IEventModel[]) {
        return items.map((item) => ({
            id: (
                <Link to={ROUTER.MAIN.EVENTS.DETAILS.PATH + item._id}>
                    {item._id}
                </Link>
            ),
            time: calculateTimeString(item),
            name: item.title,
        }));
    },
};

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
        renderBody: () => (
            <React.Fragment>
                <Typography.Paragraph>
                    {i18n.t('Events:ownerModal.name')} {owner.name}{' '}
                    {owner.surname} {owner.patronymic}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    {i18n.t('Events:ownerModal.email')} {owner.email}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    {i18n.t('Events:ownerModal.phone')} {owner.phone}
                </Typography.Paragraph>
            </React.Fragment>
        ),
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
        width: 150,
    },
    {
        title: () => i18n.t('Events:table.header.time'),
        dataIndex: 'from',
        key: 'from',
        render: (_, record: IEventModel) => calculateTimeString(record),
        width: 150,
    },
    {
        title: () => i18n.t('Events:table.header.owner'),
        dataIndex: 'owner',
        key: 'owner',
        render: (_, record: IEventModel) => {
            const owner = record.owner as IUserModel;
            return (
                <a onClick={getOwnerClickHandler(owner)}>
                    {getOwnerName(owner)}
                </a>
            );
        },
        ellipsis: true,
        width: 250,
    },
];
