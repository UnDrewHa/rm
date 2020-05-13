import {Divider} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {BlankList} from 'modules/admin/pages/BlankList';
import {BuildingsActions} from 'modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'modules/buildings/models';
import {BuildingsService} from 'modules/buildings/service/BuildingsService';
import React from 'react';
import {connect} from 'react-redux';

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
                <EditButton
                    to={{
                        pathname: ROUTER.MAIN.ADMIN.BUILDINGS.EDIT.FULL_PATH,
                        search: `?id=${record._id}`,
                    }}
                />
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
