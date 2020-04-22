import {isEmpty} from 'lodash-es';
import MomentUtils from '@date-io/moment';
import {
    Button,
    Grid,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import i18n from 'i18next';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {ROUTER} from 'src/core/router/consts';
import {TAppStore} from 'src/core/store/model';
import {EventsActions} from 'src/modules/events/actions/EventsActions';
import {IEventModel} from 'src/modules/events/models';
import {EventsService} from 'src/modules/events/service/EventsService';
import {calculateTimeString} from 'src/modules/events/utils';
import {RoomCard} from 'src/modules/rooms/components/RoomCard';
import {Link} from 'react-router-dom';

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
                    {!isEmpty(events.data) && (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {i18n.t('Events:common.id')}
                                        </TableCell>
                                        <TableCell>
                                            {i18n.t('Events:common.time')}
                                        </TableCell>
                                        <TableCell>
                                            {i18n.t('Events:common.name')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.data.map((row) => (
                                        <TableRow key={row._id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Link
                                                    to={
                                                        ROUTER.MAIN.EVENTS
                                                            .DETAILS.PATH +
                                                        row._id
                                                    }
                                                >
                                                    {row._id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {calculateTimeString(row)}
                                            </TableCell>
                                            <TableCell>{row.title}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
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
