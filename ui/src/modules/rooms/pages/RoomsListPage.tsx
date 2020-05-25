import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    PageHeader,
    Row,
    Select,
    Skeleton,
    Slider,
    TimePicker,
} from 'antd';
import {
    rowGutters,
    DEFAULT_DATE_FORMAT,
    DEFAULT_TIME_FORMAT,
} from 'core/consts';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {disabledDate} from 'modules/events/utils';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {RoomsList} from 'modules/rooms/components/RoomsList';
import {IRoomModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import {changeOnlyDate, formatTime} from 'modules/rooms/utils';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

interface IState {
    building: IBuildingModel;
    formValues: {
        floors: number[];
        date: Moment;
        from: Moment;
        to: Moment;
        seats: number;
        tv: boolean;
        projector: boolean;
        whiteboard: boolean;
        flipchart: boolean;
        building: string;
    };
}

interface IStateProps {
    roomsList: IAsyncData<IRoomModel[]>;
    defaultBuilding: IBuildingModel;
    filterDataIsLoading: boolean;
    roomsDataIsLoading: boolean;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IStateProps & IDispatchProps;

const initialValues = {
    floors: [],
    date: moment(),
    from: moment(),
    to: moment(),
    seats: 2,
    tv: false,
    projector: false,
    whiteboard: false,
    flipchart: false,
    building: '',
};

class RoomsListPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: this.props.defaultBuilding || null,
            formValues: initialValues,
        };

        props.roomsActions.clear();
    }

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleChange = (changedValues) => {
        this.setState((prev) => ({
            formValues: {
                ...prev.formValues,
                ...changedValues,
            },
        }));
    };

    handleFinish = (values) => {
        const {
            seats,
            from,
            to,
            date,
            floors,
            tv,
            projector,
            whiteboard,
            flipchart,
        } = values;

        this.setState(
            {
                formValues: values,
            },
            () => {
                const {building} = this.state;
                const {defaultBuilding} = this.props;
                const selectedBuilding = building || defaultBuilding;

                let filter = {
                    from: formatTime(changeOnlyDate(from, date)),
                    to: formatTime(changeOnlyDate(to, date)),
                    date: date.format(DEFAULT_DATE_FORMAT),
                    building: selectedBuilding._id,
                    seats,
                    ...{floors: floors.map((item) => parseInt(item, 10))},
                    ...(tv && {tv}),
                    ...(projector && {projector}),
                    ...(whiteboard && {whiteboard}),
                    ...(flipchart && {flipchart}),
                    notReserved: true,
                };

                this.props.roomsActions.find({filter});
            },
        );
    };

    getFloorList(): {value: number; label: string}[] {
        const {building} = this.state;
        const {defaultBuilding} = this.props;
        const selectedBuilding = building || defaultBuilding;
        const FLOOR_SELECT_DISABLED = !selectedBuilding;
        if (FLOOR_SELECT_DISABLED) {
            return [];
        }

        let list = [];

        for (let i = 1; i <= selectedBuilding.floors; i++) {
            list.push({value: i, label: i18n.t('Buildings:floor', {n: i})});
        }

        return list;
    }

    render() {
        const {building, formValues} = this.state;
        const {
            defaultBuilding,
            filterDataIsLoading,
            roomsDataIsLoading,
            roomsList,
        } = this.props;
        const FLOOR_SELECT_DISABLED = !building && !defaultBuilding;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Rooms:list.title')}
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
                        {filterDataIsLoading ? (
                            <Skeleton active />
                        ) : (
                            <Form
                                validateMessages={defaultValidateMessages}
                                layout="vertical"
                                initialValues={{
                                    ...initialValues,
                                    building: defaultBuilding?.address,
                                }}
                                onFinish={this.handleFinish}
                                onValuesChange={this.handleChange}
                            >
                                <Form.Item
                                    name="building"
                                    rules={validationConsts.common.required}
                                >
                                    <BuildingsAutocomplete
                                        onSelect={this.handleBuildingSelect}
                                    />
                                </Form.Item>
                                {!FLOOR_SELECT_DISABLED && (
                                    <Form.Item
                                        name="floors"
                                        label={i18n.t(
                                            'Buildings:filter.selectFloor',
                                        )}
                                    >
                                        <Select mode="multiple">
                                            {this.getFloorList().map((item) => (
                                                <Select.Option
                                                    key={item.label}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}
                                <Form.Item
                                    name="date"
                                    label={i18n.t('Rooms:common.date')}
                                    rules={validationConsts.event.date}
                                >
                                    <DatePicker
                                        allowClear={false}
                                        disabledDate={disabledDate}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="from"
                                    label={i18n.t('Rooms:common.from')}
                                    rules={validationConsts.event.from}
                                >
                                    <TimePicker
                                        allowClear={false}
                                        format={DEFAULT_TIME_FORMAT}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="to"
                                    label={i18n.t('Rooms:common.to')}
                                    rules={validationConsts.event.to}
                                >
                                    <TimePicker
                                        allowClear={false}
                                        format={DEFAULT_TIME_FORMAT}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="seats"
                                    label={i18n.t('Rooms:common.seats', {
                                        num: formValues?.seats || null,
                                    })}
                                >
                                    <Slider
                                        min={1}
                                        max={200}
                                        tooltipPlacement="right"
                                    />
                                </Form.Item>
                                <Form.Item name="tv">
                                    <Checkbox>
                                        {i18n.t('Rooms:common.tv')}
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item name="projector">
                                    <Checkbox>
                                        {i18n.t('Rooms:common.projector')}
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item name="whiteboard">
                                    <Checkbox>
                                        {i18n.t('Rooms:common.whiteboard')}
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item name="flipchart">
                                    <Checkbox>
                                        {i18n.t('Rooms:common.flipchart')}
                                    </Checkbox>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={roomsDataIsLoading}
                                >
                                    {i18n.t('actions.find')}
                                </Button>
                            </Form>
                        )}
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={16} xl={18}>
                        <RoomsList
                            rooms={roomsList.data}
                            isLoading={roomsDataIsLoading}
                            renderActions={(item) => (
                                <React.Fragment>
                                    <Link
                                        to={{
                                            pathname:
                                                ROUTER.MAIN.EVENTS.CREATE
                                                    .FULL_PATH,
                                            state: {
                                                date:
                                                    this.state?.formValues
                                                        ?.date || null,
                                                from:
                                                    this.state?.formValues
                                                        ?.from || null,
                                                to:
                                                    this.state?.formValues
                                                        ?.to || null,
                                            },
                                            search: `?room=${item._id}`,
                                        }}
                                    >
                                        {i18n.t('Rooms:common.reserve')}
                                    </Link>
                                    <Divider type="vertical" />
                                    <Link
                                        to={
                                            ROUTER.MAIN.ROOMS.DETAILS.PATH +
                                            item._id
                                        }
                                    >
                                        {i18n.t('Rooms:common.schedule')}
                                    </Link>
                                </React.Fragment>
                            )}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        roomsList: state.rooms.list,
        defaultBuilding: state.users.profile.data.building,
        filterDataIsLoading:
            state.buildings.list.status === EStatusCodes.PENDING ||
            state.users.profile.status === EStatusCodes.PENDING,
        roomsDataIsLoading: state.rooms.list.status === EStatusCodes.PENDING,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    roomsActions: new RoomsActions(new RoomsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomsListPage);

export {connected as RoomsListPage};
