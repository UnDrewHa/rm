import {SearchOutlined} from '@ant-design/icons';
import {Button, Divider, Tooltip} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {DeleteButton} from 'src/Core/components/DeleteButton';
import {EditButton} from 'src/Core/components/EditButton';
import {EStatusCodes} from 'src/Core/reducer/enums';
import {IAsyncData} from 'src/Core/reducer/model';
import {TAppStore} from 'src/Core/store/model';
import {BlankList} from 'src/Modules/admin/pages/BlankList';
import {BuildingsAutocomplete} from 'src/Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'src/Modules/buildings/models';
import {RoomsActions} from 'src/Modules/rooms/actions/RoomsActions';
import {IRoomModel} from 'src/Modules/rooms/models';
import {RoomsService} from 'src/Modules/rooms/service/RoomsService';

const getColumnsConfig = (actions, getColumnSearchProps) => [
    {
        title: () => i18n.t('table.header.name'),
        dataIndex: 'name',
        key: 'name',
        ...getColumnSearchProps('name'),
    },
    {
        title: () => i18n.t('table.header.description'),
        dataIndex: 'description',
        key: 'description',
        ...getColumnSearchProps('description'),
    },
    {
        title: () => i18n.t('table.header.seats'),
        dataIndex: 'seats',
        key: 'seats',
        ...getColumnSearchProps('seats'),
    },
    {
        title: () => i18n.t('table.header.floor'),
        dataIndex: 'floor',
        key: 'floor',
        ...getColumnSearchProps('floor'),
    },
    {
        title: () => i18n.t('table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <React.Fragment>
                <EditButton id={record._id} pathname="ROOMS" />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
            </React.Fragment>
        ),
    },
];

interface IStateProps {
    items: IAsyncData<IRoomModel[]>;
}

interface IDispatchProps {
    actions: RoomsActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    building: IBuildingModel;
}

class RoomsList extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: null,
        };

        props.actions.clear();
    }

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleFind = () => {
        const {actions} = this.props;

        actions.find({
            filter: {
                building: this.state.building._id,
            },
        });
    };

    renderTitle = () => (
        <div className="admin-table__title">
            <BuildingsAutocomplete onSelect={this.handleBuildingSelect} />
            <Tooltip title={i18n.t('Users:admin.selectBuilding')}>
                <Button
                    onClick={this.handleFind}
                    type="primary"
                    icon={<SearchOutlined />}
                    disabled={!this.state.building}
                >
                    {i18n.t('actions.find')}
                </Button>
            </Tooltip>
        </div>
    );

    render() {
        const {actions, items} = this.props;

        return (
            <BlankList
                getConfig={getColumnsConfig}
                actions={actions}
                items={items.data}
                isLoading={items.status === EStatusCodes.PENDING}
                title={this.renderTitle}
            />
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        items: state.rooms.list,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new RoomsActions(new RoomsService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomsList);

export {connected as RoomsList};
