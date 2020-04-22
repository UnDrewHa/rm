import React from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Input,
    Typography,
    Slider,
    Button,
    Card,
    FormControlLabel,
    CardMedia,
    CardContent,
    CardActions,
} from '@material-ui/core';
import {EEventNames} from 'src/core/EventEmitter/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {ROUTER} from 'src/core/router/consts';
import {TAppStore} from 'src/core/store/model';
import {BuildingsAutocomplete} from 'src/modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'src/modules/buildings/models';
import i18n from 'i18next';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment, {Moment} from 'moment';
import {RoomsActions} from 'src/modules/rooms/actions/RoomsActions';
import {IRoomModel} from 'src/modules/rooms/models';
import {RoomsService} from 'src/modules/rooms/service/RoomsService';
import {EventEmiter} from 'src/core/EventEmitter/EventEmitter';

interface IState {
    building: IBuildingModel;
    floors: string[];
    date: Moment;
    timeFrom: Moment;
    timeTo: Moment;
    seats: number;
    tv: boolean;
    projector: boolean;
    whiteboard: boolean;
    flipchart: boolean;
}

interface IStateProps {
    roomsList: IAsyncData<IRoomModel[]>;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IStateProps & IDispatchProps;

/**
 * Обновить в объекте time только день, месяц и год, оставив время.
 *
 * @param {Moment} time Объект, который меняем.
 * @param {Moment} date Объект, у которого берем значения.
 */
const changeOnlyDate = (time: Moment, date: Moment) => {
    let newTime = moment(time);

    newTime.set('year', date.get('year'));
    newTime.set('month', date.get('month'));
    newTime.set('date', date.get('date'));

    return newTime;
};

class RoomsList extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            building: null,
            floors: [],
            date: moment(new Date()),
            timeFrom: moment(new Date()),
            timeTo: moment(new Date()),
            seats: 2,
            tv: false,
            projector: false,
            whiteboard: false,
            flipchart: false,
        };
    }

    /**
     * Обработчик выбора здания.
     *
     * @param {IBuildingModel} building Выбранное здание.
     */
    handleBuildingSelect = (building: IBuildingModel) => {
        this.setState({
            building,
        });
    };

    handleFloorChange = (event) => {
        this.setState({
            floors: [...event.target.value],
        });
    };

    handleDateChange = (date) => {
        this.setState<never>((prev) => ({
            date,
            timeFrom: changeOnlyDate(prev.timeFrom, date),
            timeTo: changeOnlyDate(prev.timeTo, date),
        }));
    };

    handleTimeChange = (timeKey) => (time) => {
        this.setState<never>({
            [timeKey]: time,
        });
    };

    createCheckboxHandler = (key) => (event) => {
        this.setState<never>({
            [key]: event.target.checked,
        });
    };

    handleSeatsChange = (_: object, seats: number) => {
        this.setState({
            seats,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const {
            floors,
            building,
            date,
            timeFrom,
            timeTo,
            seats,
            tv,
            projector,
            whiteboard,
            flipchart,
        } = this.state;

        let filter = {
            dateFrom: moment(timeFrom).utc().format(),
            dateTo: moment(timeTo).utc().format(),
            date: moment(date).utc().format('DD-MM-YYYY'), //TODO: форматирование в константы
            building: building._id,
            seats,
            ...{floors: floors.map((item) => parseInt(item, 10))},
            ...(tv && {tv}),
            ...(projector && {projector}),
            ...(whiteboard && {whiteboard}),
            ...(flipchart && {flipchart}),
            notReserved: true,
        };

        this.props.roomsActions.find({filter});
    };

    handleShowSchedule = (e) => {
        e.preventDefault();
        EventEmiter.emit(EEventNames.REDIRECT, {
            to: ROUTER.MAIN.ROOMS.DETAILS.FULL_PATH,
            params: {
                id: e.currentTarget.dataset.id,
            },
        });
    };

    getFloorList(): string[] {
        const {building} = this.state;
        const FLOOR_SELECT_DISABLED = !building;
        if (FLOOR_SELECT_DISABLED) {
            return [];
        }

        let list = [];

        for (let i = 1; i <= building.floors; i++) {
            list.push(i18n.t('Buildings:floor', {n: i}));
        }

        return list;
    }

    render() {
        const {
            floors,
            building,
            date,
            timeFrom,
            timeTo,
            seats,
            tv,
            projector,
            whiteboard,
            flipchart,
        } = this.state;
        const {roomsList} = this.props;
        const FLOOR_SELECT_DISABLED = !building;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item sm={12} md={3} lg={2}>
                    <form onSubmit={this.handleSubmit}>
                        <BuildingsAutocomplete
                            onSelect={this.handleBuildingSelect}
                        />
                        <FormControl variant="outlined">
                            <InputLabel id="floor">
                                {i18n.t('Buildings:filter.selectFloor')}
                            </InputLabel>
                            <Select
                                labelId="floor"
                                id="floor-checkbox"
                                multiple
                                value={floors}
                                onChange={this.handleFloorChange}
                                input={<Input />}
                                renderValue={(selected: string[]) =>
                                    selected.join(', ')
                                }
                                disabled={FLOOR_SELECT_DISABLED}
                            >
                                {!FLOOR_SELECT_DISABLED &&
                                    this.getFloorList().map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox
                                                checked={
                                                    floors.indexOf(name) > -1
                                                }
                                            />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <br />
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
                        <Typography id="discrete-slider" gutterBottom>
                            {i18n.t('Rooms:common.seats')}
                        </Typography>
                        <Slider
                            defaultValue={30}
                            valueLabelDisplay="auto"
                            step={1}
                            min={1}
                            max={100}
                            value={seats}
                            onChange={this.handleSeatsChange}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tv}
                                    onChange={this.createCheckboxHandler('tv')}
                                    name="tv"
                                    color="primary"
                                />
                            }
                            label={i18n.t('Rooms:common.tv')}
                        />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={projector}
                                    onChange={this.createCheckboxHandler(
                                        'projector',
                                    )}
                                    name="projector"
                                    color="primary"
                                />
                            }
                            label={i18n.t('Rooms:common.projector')}
                        />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={whiteboard}
                                    onChange={this.createCheckboxHandler(
                                        'whiteboard',
                                    )}
                                    name="whiteboard"
                                    color="primary"
                                />
                            }
                            label={i18n.t('Rooms:common.whiteboard')}
                        />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={flipchart}
                                    onChange={this.createCheckboxHandler(
                                        'flipchart',
                                    )}
                                    name="flipchart"
                                    color="primary"
                                />
                            }
                            label={i18n.t('Rooms:common.flipchart')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {i18n.t('actions.find')}
                        </Button>
                    </form>
                </Grid>
                <Grid item sm={12} md={9} lg={10}>
                    <Grid container direction="column" spacing={1}>
                        {roomsList.data.map((room) => (
                            <Grid item sm={12} key={room._id}>
                                <Card>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="stretch"
                                    >
                                        <Grid item sm={12} lg={2}>
                                            <CardMedia
                                                component="img"
                                                src="http://localhost:5000/img/hiex-moscow-sheremetyevo-Europe.jpg"
                                            />
                                        </Grid>
                                        <Grid item sm={12} lg={8}>
                                            <CardContent>
                                                <Typography>
                                                    {i18n.t('Buildings:floor', {
                                                        n: room.floor,
                                                    })}
                                                </Typography>
                                                <Typography>
                                                    {room.name}
                                                </Typography>
                                                <Typography>
                                                    {room.description}
                                                </Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid item sm={12} lg={2}>
                                            <CardActions>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    {i18n.t(
                                                        'Rooms:common.reserve',
                                                    )}
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={
                                                        this.handleShowSchedule
                                                    }
                                                    data-id={room._id}
                                                >
                                                    {i18n.t(
                                                        'Rooms:common.schedule',
                                                    )}
                                                </Button>
                                            </CardActions>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    roomsList: state.rooms.list,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    roomsActions: new RoomsActions(new RoomsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomsList);

export {connected as RoomsList};
