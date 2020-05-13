import {SearchOutlined} from '@ant-design/icons';
import {Button, Checkbox, Divider, Tooltip} from 'antd';
import {ButtonsRow} from 'core/components/ButtonsRow';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {QrButton} from 'core/components/QrButton';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import {BlankList} from 'modules/admin/pages/BlankList';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {IRoomModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
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
        title: () => i18n.t('table.header.needApprove'),
        dataIndex: 'needApprove',
        key: 'needApprove',
        render: (_, record) => <Checkbox checked={record.needApprove} />,
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
            return value === record.active;
        },
    },
    {
        title: () => i18n.t('table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <React.Fragment>
                <EditButton
                    to={{
                        pathname: ROUTER.MAIN.ADMIN.ROOMS.EDIT.FULL_PATH,
                        search: `?id=${record._id}`,
                    }}
                />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
                <Divider type="vertical" />
                <QrButton ids={[record._id]} actions={actions} />
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

    renderFooter = (actions, selectedRowKeys, handleAfterDelete) => {
        return isEmpty(selectedRowKeys) ? null : (
            <ButtonsRow>
                <DeleteButton
                    actions={actions}
                    layout="button"
                    ids={selectedRowKeys}
                    placement="right"
                    afterDelete={handleAfterDelete}
                />
                <QrButton
                    layout="button"
                    ids={selectedRowKeys}
                    actions={actions}
                />
            </ButtonsRow>
        );
    };

    render() {
        const {actions, items} = this.props;

        return (
            <BlankList
                getConfig={getColumnsConfig}
                actions={actions}
                items={items.data}
                isLoading={items.status === EStatusCodes.PENDING}
                title={this.renderTitle}
                renderFooter={this.renderFooter}
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
