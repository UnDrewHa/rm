import MomentUtils from '@date-io/moment';
import {Button, Grid} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import i18n from 'i18next';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {EventsTable} from 'Modules/events/components/EventsTable';
import {IEventModel} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {RoomCard} from 'Modules/rooms/components/RoomCard';

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

class RoomSchedulePage extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        const {eventsActions, match} = props;
        const date = moment(new Date());

        this.state = {
            date,
        };

        eventsActions.find({
            filter: {
                room: match.params.id,
                date: date.utc().format('DD-MM-YYYY'),
            },
        });
    }

    handleDateChange = (date) => {
        this.setState<never>(
            {
                date,
            },
            () => {
                const {eventsActions, match} = this.props;
                eventsActions.find({
                    filter: {
                        room: match.params.id,
                        date: this.state.date.utc().format('DD-MM-YYYY'),
                    },
                });
            },
        );
    };

    render() {
        const {date} = this.state;
        const {events, match} = this.props;
        const {id} = match?.params || '';
        const isLoading = events.status === EStatusCodes.PENDING;

        if (isLoading) return <LoadingOverlay open />;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item sm={12} md={3} lg={3}>
                    <Button fullWidth variant="contained" color="primary">
                        {i18n.t('Rooms:common.reserve')}
                    </Button>
                    <MuiPickersUtilsProvider
                        libInstance={moment}
                        utils={MomentUtils}
                    >
                        <DatePicker
                            autoOk
                            variant="static"
                            openTo="date"
                            label={i18n.t('Rooms:common.date')}
                            value={date}
                            onChange={this.handleDateChange}
                        />
                    </MuiPickersUtilsProvider>
                    <RoomCard id={id} />
                </Grid>
                <Grid item sm={12} md={9} lg={9}>
                    <EventsTable events={events.data} />
                </Grid>
            </Grid>
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
