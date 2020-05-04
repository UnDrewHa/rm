import {Button, Calendar, Col, PageHeader, Row, Table} from 'antd';
import i18n from 'i18next';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {commonTableProps, DEFAULT_DATE_FORMAT} from 'Core/consts';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {baseColumnsConfig} from 'Modules/events/components/utils';
import {IEventModel} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {RoomCard} from 'Modules/rooms/components/RoomCard';
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

interface IOwnProps {
    match: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const getFilter = (id, date) => ({
    room: id,
    date: date.format(DEFAULT_DATE_FORMAT),
    populateOwner: true,
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
        const {id} = match?.params || '';

        InterfaceAction.redirect({
            to: ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
            search: {
                room: id,
            },
        });
    };

    handleBack = () => {
        InterfaceAction.redirect(ROUTER.MAIN.FULL_PATH);
    };

    render() {
        const {date} = this.state;
        const {events, match} = this.props;
        const {id} = match?.params || '';
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
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={5} className="border-right">
                        <Calendar
                            fullscreen={false}
                            onSelect={this.handleDateChange}
                            value={date}
                            className="room-schedule-calendar"
                        />
                        <RoomCard id={id} />
                    </Col>
                    <Col span={19}>
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
