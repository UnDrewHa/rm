import {Divider} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {DeleteButton} from 'src/Core/components/DeleteButton';
import {EditButton} from 'src/Core/components/EditButton';
import {EStatusCodes} from 'src/Core/reducer/enums';
import {IAsyncData} from 'src/Core/reducer/model';
import {TAppStore} from 'src/Core/store/model';
import {BlankList} from 'src/Modules/admin/pages/BlankList';
import {BuildingsActions} from 'src/Modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'src/Modules/buildings/models';
import {BuildingsService} from 'src/Modules/buildings/service/BuildingsService';

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

interface IStateProps {
    items: IAsyncData<IBuildingModel[]>;
}

interface IDispatchProps {
    actions: BuildingsActions;
}

type TProps = IStateProps & IDispatchProps;

class BuildingsList extends React.Component<TProps> {
    constructor(props: TProps) {
        super(props);

        const {actions} = props;

        actions.getAll();
    }

    render() {
        const {actions, items} = this.props;

        return (
            <BlankList
                getConfig={getColumnsConfig}
                actions={actions}
                items={items.data}
                isLoading={items.status === EStatusCodes.PENDING}
            />
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        items: state.buildings.list,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new BuildingsActions(new BuildingsService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(BuildingsList);

export {connected as BuildingsList};
