import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Empty,
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
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {find} from 'lodash-es';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {disabledDate} from 'modules/events/utils';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {FloorPlanView} from 'modules/rooms/components/FloorPlanView';
import {IRoomModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import {changeOnlyDate, formatTime} from 'modules/rooms/utils';
import moment, {Moment} from 'moment';
import React from 'react';
import {connect} from 'react-redux';

interface IState {
    building: IBuildingModel;
    formValues: {
        floor: number;
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
    filterDataIsLoading: boolean;
    roomsDataIsLoading: boolean;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IStateProps & IDispatchProps;

const initialValues = {
    floor: 1,
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

class RoomsMapPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: null,
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

    handleFinish = (values) => {
        const {
            seats,
            from,
            to,
            date,
            floor,
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

                let filter = {
                    from: formatTime(changeOnlyDate(from, date)),
                    to: formatTime(changeOnlyDate(to, date)),
                    date: date.format(DEFAULT_DATE_FORMAT),
                    building: building._id,
                    floors: [floor],
                    seats,
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
        const FLOOR_SELECT_DISABLED = !building;
        if (FLOOR_SELECT_DISABLED) {
            return [];
        }

        let list = [];

        for (let i = 1; i <= building.floors; i++) {
            list.push({value: i, label: i18n.t('Buildings:floor', {n: i})});
        }

        return list;
    }

    render() {
        const {building, formValues} = this.state;
        const {filterDataIsLoading, roomsDataIsLoading, roomsList} = this.props;
        const FLOOR_SELECT_DISABLED = !building;
        const floorData = find(
            building?.floorsData,
            (item) => item.floorNumber === formValues.floor,
        );

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Rooms:map.title')}
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
                                initialValues={initialValues}
                                onFinish={this.handleFinish}
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
                                        name="floor"
                                        label={i18n.t(
                                            'Buildings:filter.selectFloor',
                                        )}
                                    >
                                        <Select>
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
                        {!!building &&
                        !!floorData &&
                        roomsList.status === EStatusCodes.SUCCESS ? (
                            <FloorPlanView
                                enabledRooms={roomsList.data}
                                data={floorData}
                                buildingId={building._id}
                                formValues={formValues}
                            />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Нет данных по плану этажа"
                            />
                        )}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        roomsList: state.rooms.list,
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
)(RoomsMapPage);

export {connected as RoomsMapPage};
