import {Button, Calendar, Col, PageHeader, Row, Table} from 'antd';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {commonTableProps, rowGutters, DEFAULT_DATE_FORMAT} from 'core/consts';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {baseColumnsConfig} from 'modules/events/components/utils';
import {IEventModel} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {RoomCard} from 'modules/rooms/components/RoomCard';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteChildrenProps} from 'react-router-dom';
import '../styles/schedule.scss';

interface IState {
    date: Moment;
}

interface IStateProps {
    events: IAsyncData<IEventModel[]>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps extends RouteChildrenProps<{id: string}> {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const getFilter = (id, date) => ({
    room: id,
    date: date.format(DEFAULT_DATE_FORMAT),
});

class RoomSchedulePage extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        const {eventsActions, match} = props;
        const date = moment(new Date());

        this.state = {
            date,
        };

        eventsActions.find({
            filter: getFilter(match.params.id, date),
        });
    }

    handleDateChange = (date: Moment) => {
        this.setState<never>(
            {
                date,
            },
            () => {
                const {eventsActions, match} = this.props;
                eventsActions.find({
                    filter: getFilter(match.params.id, this.state.date),
                });
            },
        );
    };

    handleReserve = (e) => {
        e.preventDefault();
        const {match} = this.props;
        const {id} = match?.params || {};

        InterfaceAction.redirect({
            to: ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
            search: {
                room: id,
            },
        });
    };

    handleBack = () => {
        window.history.back();
    };

    render() {
        const {date} = this.state;
        const {events, match} = this.props;
        const {id} = match?.params || {};
        const isLoading = events.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Rooms:schedule.title')}
                    extra={
                        <Button
                            type="primary"
                            className="room-reserve-button"
                            onClick={this.handleReserve}
                        >
                            {i18n.t('Rooms:common.reserve')}
                        </Button>
                    }
                    onBack={this.handleBack}
                />
                <Row gutter={rowGutters}>
                    <Col
                        xs={24}
                        sm={24}
                        md={10}
                        lg={8}
                        xl={6}
                        className="border-right"
                    >
                        <Calendar
                            fullscreen={false}
                            onSelect={this.handleDateChange}
                            value={date}
                            className="room-schedule-calendar"
                        />
                        <RoomCard id={id} />
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={16} xl={18}>
                        <Table
                            {...commonTableProps}
                            columns={baseColumnsConfig}
                            dataSource={events.data}
                            loading={isLoading}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    eventsActions: new EventsActions(new EventsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(RoomSchedulePage),
);

export {connected as RoomSchedulePage};
