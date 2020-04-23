import MomentUtils from '@date-io/moment';
import {Button, Grid, TextField} from '@material-ui/core';
import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import i18n from 'i18next';
import {memoize} from 'lodash-es';
import moment, {Moment} from 'moment';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {EventsTable} from 'Modules/events/components/EventsTable';
import {IEventModel} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {RoomCard} from 'Modules/rooms/components/RoomCard';
import {changeOnlyDate} from 'Modules/rooms/utils';
import {IUserModel} from 'Modules/users/models';

interface IState {
    title: string;
    date: Moment;
    timeFrom: Moment;
    timeTo: Moment;
    room: string;
    owner: string;
    description: string;
}

interface IStateProps {
    events: IAsyncData<IEventModel[]>;
    details: IAsyncData<IEventModel>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps {
    match: any;
    location: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class EventEditPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {location, userInfo, eventsActions} = props;
        const parsed = queryParser.parse(location.search);
        const roomId = (parsed.room as string) || '';

        this.state = {
            title: location?.state?.title || '',
            date: location?.state?.date || moment(),
            timeFrom: location?.state?.timeFrom || moment(),
            timeTo: location?.state?.timeTo || moment(),
            room: roomId,
            owner: userInfo.data._id,
            description: location?.state?.description || '',
        };

        eventsActions.find({
            filter: {
                room: roomId,
                date: this.state.date.format('DD-MM-YYYY'),
            },
        });
    }

    componentDidUpdate(prev) {
        const {details} = this.props;

        if (
            details.status === EStatusCodes.SUCCESS &&
            prev.details.data !== details.data
        ) {
            InterfaceAction.notify(i18n.t('Events:create.success'), 'success');
            InterfaceAction.redirect({
                to: ROUTER.MAIN.EVENTS.DETAILS.FULL_PATH,
                params: {
                    id: details.data._id,
                },
            });
        }
    }

    /**
     * Создать обработчик поля в state.
     */
    createFieldChangeHandler = memoize((field: keyof IState) => (event) => {
        this.setState<never>({
            [field]: event.target.value,
        });
    });

    handleDateChange = (date) => {
        this.setState<never>(
            (prev) => ({
                date,
                timeFrom: changeOnlyDate(prev.timeFrom, date),
                timeTo: changeOnlyDate(prev.timeTo, date), //TODO во всем местах сделать установку даты еще и во время отправки формы.
            }),
            () => {
                this.props.eventsActions.find({
                    filter: {
                        room: this.state.room,
                        date: this.state.date.format('DD-MM-YYYY'),
                    },
                });
            },
        );
    };

    handleTimeChange = (timeKey) => (time) => {
        this.setState<never>({
            [timeKey]: time,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            date,
            timeFrom,
            timeTo,
            title,
            description,
            owner,
            room,
        } = this.state;
        const {eventsActions} = this.props;

        eventsActions.create({
            title,
            from: timeFrom.utc().format(),
            to: timeTo.utc().format(),
            date: date.utc().format('DD-MM-YYYY'),
            room,
            owner,
            description,
        });
    };

    render() {
        const {date, timeFrom, timeTo, title, description} = this.state;
        const {events, details} = this.props;
        const submitDisabled = details.status === EStatusCodes.PENDING;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item sm={12} md={2} lg={2}>
                    <RoomCard id={this.state.room} />
                </Grid>
                <Grid item sm={12} md={5} lg={5}>
                    <form onSubmit={this.handleSubmit}>
                        <MuiPickersUtilsProvider
                            libInstance={moment}
                            utils={MomentUtils}
                        >
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label={i18n.t('Rooms:common.date')}
                                value={date}
                                onChange={this.handleDateChange}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label={i18n.t('Rooms:common.timeFrom')}
                                value={timeFrom}
                                onChange={this.handleTimeChange('timeFrom')}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label={i18n.t('Rooms:common.timeTo')}
                                value={timeTo}
                                onChange={this.handleTimeChange('timeTo')}
                            />
                        </MuiPickersUtilsProvider>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label={i18n.t('words.title')}
                            name="title"
                            value={title}
                            onChange={this.createFieldChangeHandler('title')}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label={i18n.t('words.description')}
                            name="description"
                            value={description}
                            multiline
                            onChange={this.createFieldChangeHandler(
                                'description',
                            )}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submitDisabled}
                        >
                            {i18n.t('actions.create')}
                        </Button>
                    </form>
                </Grid>
                <Grid item sm={12} md={5} lg={5}>
                    <EventsTable events={events.data} />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
    details: state.events.details,
    userInfo: state.user,
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
    )(EventEditPage),
);

export {connected as EventEditPage};
