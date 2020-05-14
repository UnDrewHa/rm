import {SearchOutlined} from '@ant-design/icons';
import {Button, Checkbox, DatePicker, Divider, Tooltip} from 'antd';
import {ButtonsRow} from 'core/components/ButtonsRow';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {QrButton} from 'core/components/QrButton';
import {DEFAULT_DATE_FORMAT} from 'core/consts';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import {BlankList} from 'modules/admin/pages/BlankList';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {EventStatus} from 'modules/events/components/EventStatus';
import {EApproveStatuses} from 'modules/events/enums';
import {IEventModel} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {calculateTimeString, disabledDate} from 'modules/events/utils';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';

const getColumnsConfig = (actions, getColumnSearchProps) => {
    const handleApprove = (ids: string[]) => () => {
        actions.approve(ids);
    };

    const handleRefuse = (ids: string[]) => () => {
        actions.refuse(ids);
    };

    return [
        {
            title: () => i18n.t('Events:table.header.title'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: () => i18n.t('Events:table.header.description'),
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: () => i18n.t('Events:table.header.room'),
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: () => i18n.t('Events:table.header.owner'),
            dataIndex: 'owner',
            key: 'owner',
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
            title: () => i18n.t('table.header.actions'),
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <React.Fragment>
                    <Button onClick={handleApprove([record._id])} type="link">
                        APPROVE
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={handleRefuse([record._id])}
                        type="link"
                        danger
                    >
                        REFUSE
                    </Button>
                </React.Fragment>
            ),
        },
    ];
};

interface IStateProps {
    items: IAsyncData<IEventModel[]>;
}

interface IDispatchProps {
    actions: EventsActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    building: IBuildingModel;
    date: Moment;
}

class EventsList extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: null,
            date: moment(),
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

    handleDateChange = (date: Moment) => {
        this.setState({
            date,
        });
    };

    handleFind = () => {
        const {actions} = this.props;
        const {date, building} = this.state;

        actions.getForApproving({
            date: date.format(DEFAULT_DATE_FORMAT),
            building: building._id,
        });
    };

    renderTitle = () => {
        const {date, building} = this.state;

        return (
            <div className="admin-table__title">
                <BuildingsAutocomplete onSelect={this.handleBuildingSelect} />
                <DatePicker
                    allowClear={false}
                    disabledDate={disabledDate}
                    onChange={this.handleDateChange}
                    value={date}
                />
                <Tooltip title={i18n.t('Users:admin.selectBuilding')}>
                    <Button
                        onClick={this.handleFind}
                        type="primary"
                        icon={<SearchOutlined />}
                        disabled={!building}
                    >
                        {i18n.t('actions.find')}
                    </Button>
                </Tooltip>
            </div>
        );
    };

    renderFooter = (actions, selectedRowKeys) => {
        return isEmpty(selectedRowKeys) ? null : (
            <ButtonsRow>
                <Button onClick={() => actions.refuse(selectedRowKeys)}>
                    REFUSE
                </Button>
                <Button onClick={() => actions.approve(selectedRowKeys)}>
                    APPROVE
                </Button>
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
        items: state.events.list,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new EventsActions(new EventsService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EventsList);

export {connected as EventsList};
