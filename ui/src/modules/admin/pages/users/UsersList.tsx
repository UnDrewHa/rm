import {Checkbox, Divider} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {DeleteButton} from 'Core/components/DeleteButton';
import {EditButton} from 'Core/components/EditButton';
import {BlankList} from 'Modules/admin/pages/BlankList';
import {ERoles} from 'Modules/permissions/enums';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {UsersService} from 'Modules/users/service/UsersService';

const getColumnsConfig = (actions, getColumnSearchProps) => [
    {
        title: () => i18n.t('table.header.fullName'),
        dataIndex: 'fullName',
        key: 'fullName',
        ...getColumnSearchProps('fullName'),
    },
    {
        title: () => i18n.t('table.header.login'),
        dataIndex: 'login',
        key: 'login',
        ...getColumnSearchProps('login'),
    },
    {
        title: () => i18n.t('table.header.email'),
        dataIndex: 'email',
        key: 'email',
        ...getColumnSearchProps('email'),
    },
    {
        title: () => i18n.t('table.header.phone'),
        dataIndex: 'phone',
        key: 'phone',
        ...getColumnSearchProps('phone'),
    },
    {
        title: () => i18n.t('table.header.role'),
        dataIndex: 'role',
        key: 'role',
        filters: [
            {
                text: ERoles.ADMIN,
                value: ERoles.ADMIN,
            },
            {
                text: ERoles.USER,
                value: ERoles.USER,
            },
        ],
        onFilter: (value, record) => record.role === value,
    },
    {
        title: () => i18n.t('table.header.active'),
        dataIndex: 'active',
        key: 'active',
        render: (_, record) => <Checkbox checked={record.active !== false} />,
        filters: [
            {
                text: i18n.t('words.yes'),
                value: true,
            },
            {
                text: i18n.t('words.no'),
                value: false,
            },
        ],
        onFilter: (value, record) => {
            return value ? record.active !== false : record.active === false;
        },
    },
    {
        title: () => i18n.t('table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <React.Fragment>
                <EditButton id={record._id} pathname="USERS" />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
            </React.Fragment>
        ),
    },
];

export const UsersList = () => {
    return (
        <BlankList
            getConfig={getColumnsConfig}
            storePath="users.list"
            action={UsersActions}
            service={UsersService}
        />
    );
};
