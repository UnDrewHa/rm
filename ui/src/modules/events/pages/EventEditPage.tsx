import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    PageHeader,
    Row,
    Table,
    TimePicker,
} from 'antd';
import i18n from 'i18next';
import moment, {Moment} from 'moment';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT} from 'Core/consts';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {columnsWithoutDescription} from 'Modules/events/components/utils';
import {IEventModel} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {disabledDate} from 'Modules/events/utils';
import {RoomCard} from 'Modules/rooms/components/RoomCard';
import {changeOnlyDate, formatTime} from 'Modules/rooms/utils';
import {IUserModel} from 'Modules/users/models';
import '../styles/events.scss';

interface IState {
    id: string;
    title: string;
    date: Moment;
    from: Moment;
    to: Moment;
    room: string;
    owner: string;
    description: string;
    members: string[];
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
            id: location?.state?.id || '',
            title: location?.state?.title || '',
            date: location?.state?.date || moment(),
            from: location?.state?.from || moment(),
            to: location?.state?.to || moment(),
            room: roomId,
            owner: userInfo.data._id,
            description: location?.state?.description || '',
            members: location?.state?.members || [],
        };

        eventsActions.find({
            filter: {
                room: roomId,
                date: this.state.date.format(DEFAULT_DATE_FORMAT),
                populateOwner: true,
            },
        });
    }

    handleDateChange = (date: Moment) => {
        this.setState(
            {
                date,
            },
            () => {
                const {location, eventsActions} = this.props;
                const roomId = queryParser.parse(location.search).room;

                eventsActions.find({
                    filter: {
                        room: roomId as string,
                        date: date.format(DEFAULT_DATE_FORMAT),
                        populateOwner: true,
                    },
                });
            },
        );
    };

    handleFinish = (values) => {
        const {date, from, to, title, description, members} = values;
        const {id, owner, room} = this.state;
        const {eventsActions} = this.props;
        const method = id ? eventsActions.update : eventsActions.create;

        method({
            _id: id,
            title,
            from: formatTime(changeOnlyDate(from, date)),
            to: formatTime(changeOnlyDate(to, date)),
            date: date.format(DEFAULT_DATE_FORMAT),
            room,
            owner,
            description,
            members,
        });
    };

    handleBack = () => {
        InterfaceAction.redirect(ROUTER.MAIN.FULL_PATH);
    };

    render() {
        const {id, room} = this.state;
        const {events, details} = this.props;
        const submitDisabled = details.status === EStatusCodes.PENDING;
        const eventsIsLoading = events.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={
                        id
                            ? i18n.t('Events:edit.title')
                            : i18n.t('Events:create.title')
                    }
                    onBack={this.handleBack}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={4} className="border-right">
                        <RoomCard id={room} />
                    </Col>
                    <Col span={9} className="border-right">
                        <Form
                            className="event-form"
                            initialValues={this.state}
                            onFinish={this.handleFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="date"
                                label={i18n.t('Rooms:common.date')}
                            >
                                <DatePicker
                                    allowClear={false}
                                    className="input40"
                                    onChange={this.handleDateChange}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                            <Form.Item
                                name="from"
                                label={i18n.t('Rooms:common.from')}
                            >
                                <TimePicker
                                    allowClear={false}
                                    format={DEFAULT_TIME_FORMAT}
                                    className="input40"
                                />
                            </Form.Item>
                            <Form.Item
                                name="to"
                                label={i18n.t('Rooms:common.to')}
                            >
                                <TimePicker
                                    allowClear={false}
                                    format={DEFAULT_TIME_FORMAT}
                                    className="input40"
                                />
                            </Form.Item>
                            <Form.Item
                                name="title"
                                label={i18n.t('words.title')}
                                rules={[
                                    {
                                        required: true,
                                        message: i18n.t('forms.requiredText'),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={i18n.t('words.description')}
                                rules={[
                                    {
                                        required: true,
                                        message: i18n.t('forms.requiredText'),
                                    },
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.List name="members">
                                {(fields, {add, remove}) => {
                                    return (
                                        <div>
                                            {fields.map((field, index) => (
                                                <Form.Item
                                                    label={
                                                        index === 0
                                                            ? i18n.t(
                                                                  'Events:edit.members.title',
                                                              )
                                                            : ''
                                                    }
                                                    required={false}
                                                    key={index}
                                                >
                                                    <Form.Item
                                                        {...field}
                                                        validateTrigger={[
                                                            'onChange',
                                                            'onBlur',
                                                        ]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: i18n.t(
                                                                    'Events:edit.members.error',
                                                                ),
                                                            },
                                                        ]}
                                                        noStyle
                                                    >
                                                        <Input
                                                            placeholder={i18n.t(
                                                                'Events:edit.members.placeholder',
                                                            )}
                                                            type="email"
                                                            className="input60"
                                                        />
                                                    </Form.Item>
                                                    {fields.length > 0 ? (
                                                        <MinusCircleOutlined
                                                            className="dynamic-delete-button"
                                                            style={{
                                                                margin: '0 8px',
                                                            }}
                                                            onClick={() => {
                                                                remove(
                                                                    field.name,
                                                                );
                                                            }}
                                                        />
                                                    ) : null}
                                                </Form.Item>
                                            ))}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                    className="input60"
                                                >
                                                    <PlusOutlined />{' '}
                                                    {i18n.t(
                                                        'Events:edit.members.add',
                                                    )}
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    );
                                }}
                            </Form.List>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={submitDisabled}
                            >
                                {i18n.t('actions.create')}
                            </Button>
                        </Form>
                    </Col>
                    <Col span={11} className="border-right">
                        <Table
                            columns={columnsWithoutDescription}
                            dataSource={events.data}
                            pagination={false}
                            rowKey="_id"
                            loading={eventsIsLoading}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
    details: state.events.details,
    userInfo: state.users.profile,
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
