import {SearchOutlined} from '@ant-design/icons';
import {Button, DatePicker, Divider, Tooltip} from 'antd';
import {ButtonsRow} from 'core/components/ButtonsRow';
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
import {IEventFullModel, IEventModel} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {calculateTimeString, disabledDate} from 'modules/events/utils';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

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
            render: (_, record: IEventFullModel) => (
                <React.Fragment>
                    <Link to={ROUTER.MAIN.ROOMS.DETAILS.PATH + record.room._id}>
                        {record.room.name}
                    </Link>
                    <br />
                    {i18n.t('Buildings:floor', {n: record.room.floor})}
                </React.Fragment>
            ),
        },
        {
            title: () => i18n.t('Events:table.header.owner'),
            dataIndex: 'owner',
            key: 'owner',
            render: (_, record: IEventFullModel) => (
                <React.Fragment>
                    {record.owner.fullName}
                    <br />
                    <a href={`mailto:${record.owner.email}`}>
                        {record.owner.email}
                    </a>
                    <br />
                    <a href={`tel:${record.owner.phone}`}>
                        {record.owner.phone}
                    </a>
                </React.Fragment>
            ),
        },
        {
            title: () => i18n.t('Events:table.header.dateTime'),
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (_, record: IEventModel) => (
                <React.Fragment>
                    {record.date}
                    <br />
                    {calculateTimeString(record)}
                </React.Fragment>
            ),
        },
        {
            title: () => i18n.t('table.header.actions'),
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <React.Fragment>
                    <Button onClick={handleApprove([record._id])} type="link">
                        {i18n.t('Events:approve.title')}
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={handleRefuse([record._id])}
                        type="link"
                        danger
                    >
                        {i18n.t('Events:refuse.title')}
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
                    {i18n.t('Events:approve.title')}
                </Button>
                <Button onClick={() => actions.approve(selectedRowKeys)}>
                    {i18n.t('Events:refuse.title')}
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
