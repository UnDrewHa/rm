import {Divider} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {DeleteButton} from 'Core/components/DeleteButton';
import {EditButton} from 'Core/components/EditButton';
import {BlankList} from 'Modules/admin/pages/BlankList';
import {BuildingsActions} from 'Modules/buildings/actions/BuildingsActions';
import {BuildingsService} from 'Modules/buildings/service/BuildingsService';

const getColumnsConfig = (actions, getColumnSearchProps) => [
    {
        title: () => i18n.t('table.header.name'),
        dataIndex: 'name',
        key: 'name',
        ...getColumnSearchProps('name'),
    },
    {
        title: () => i18n.t('table.header.address'),
        dataIndex: 'address',
        key: 'address',
        ...getColumnSearchProps('address'),
    },
    {
        title: () => i18n.t('table.header.floors'),
        dataIndex: 'floors',
        key: 'floors',
    },
    {
        title: () => i18n.t('table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <React.Fragment>
                <EditButton id={record._id} pathname="BUILDINGS" />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
            </React.Fragment>
        ),
    },
];

export const BuildingsList = () => {
    return (
        <BlankList
            getConfig={getColumnsConfig}
            storePath="buildings.list"
            action={BuildingsActions}
            service={BuildingsService}
        />
    );
};
