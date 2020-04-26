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
import i18n from 'i18next';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT} from 'Core/consts';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {
    getUserBuilding,
    BuildingsAutocomplete,
} from 'Modules/buildings/components/BuildingsAutocompleteANT';
import {IBuildingModel} from 'Modules/buildings/models';
import {RoomsActions} from 'Modules/rooms/actions/RoomsActions';
import {RoomsList} from 'Modules/rooms/components/RoomsList';
import {IRoomModel} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';
import {changeOnlyDate, formatTime} from 'Modules/rooms/utils';

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
};

class RoomsListPage extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            building: this.props.defaultBuilding || null,
            formValues: null,
        };
    }

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
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
        const {building} = this.state;
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

                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={4} className="border-right">
                        {filterDataIsLoading ? (
                            <Skeleton active />
                        ) : (
                            <Form
                                layout="vertical"
                                initialValues={{
                                    ...initialValues,
                                    building: defaultBuilding?.address,
                                }}
                                onFinish={this.handleFinish}
                            >
                                <Form.Item
                                    name="building"
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                >
                                    <DatePicker allowClear={false} />
                                </Form.Item>
                                <Form.Item
                                    name="from"
                                    label={i18n.t('Rooms:common.from')}
                                >
                                    <TimePicker
                                        allowClear={false}
                                        format={DEFAULT_TIME_FORMAT}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="to"
                                    label={i18n.t('Rooms:common.to')}
                                >
                                    <TimePicker
                                        allowClear={false}
                                        format={DEFAULT_TIME_FORMAT}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="seats"
                                    label={i18n.t('Rooms:common.seats')}
                                >
                                    <Slider
                                        min={1}
                                        max={200}
                                        tooltipVisible
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
                    <Col span={20}>
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
        defaultBuilding: getUserBuilding(state.buildings.data, state.user.data),
        filterDataIsLoading:
            state.buildings.status === EStatusCodes.PENDING ||
            state.user.status === EStatusCodes.PENDING,
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
