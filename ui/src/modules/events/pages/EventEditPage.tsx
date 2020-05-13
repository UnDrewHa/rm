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
import {
    commonTableProps,
    DEFAULT_DATE_FORMAT,
    DEFAULT_TIME_FORMAT,
} from 'core/consts';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {columnsWithoutDescription} from 'modules/events/components/utils';
import {IEventModel} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {disabledDate} from 'modules/events/utils';
import {RoomCard} from 'modules/rooms/components/RoomCard';
import {changeOnlyDate, formatTime} from 'modules/rooms/utils';
import {IUserModel} from 'modules/users/models';
import moment, {Moment} from 'moment';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteChildrenProps} from 'react-router-dom';
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

interface ILocationState {
    id?: string;
    title?: string;
    date?: Moment;
    from?: Moment;
    to?: Moment;
    description?: string;
    members?: string[];
}

interface IOwnProps extends RouteChildrenProps<{}, ILocationState> {}

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
        window.history.back();
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
                            validateMessages={defaultValidateMessages}
                            className="event-form"
                            initialValues={this.state}
                            onFinish={this.handleFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="date"
                                label={i18n.t('Rooms:common.date')}
                                rules={validationConsts.event.date as any}
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
                                rules={validationConsts.event.from as any}
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
                                rules={validationConsts.event.to as any}
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
                                rules={validationConsts.event.title}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={i18n.t('words.description')}
                                rules={[
                                    {
                                        required: true,
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
                            {...commonTableProps}
                            columns={columnsWithoutDescription}
                            dataSource={events.data}
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
